import { Injectable } from '@angular/core';
import {
  OAuth2AuthenticateOptions,
  OAuth2Client,
} from '@byteowls/capacitor-oauth2';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';
import { Browser } from '@capacitor/browser';
import { UserInput, UserModel } from './auth.interfaces';
import jwtDecode from 'jwt-decode';
import { LoggingService } from '../logging/logging.service';

enum AuthServiceStorageEnum {
  accessToken = 'ACCESS_TOKEN',
  expiresIn = 'EXPIRES_IN',
  refreshToken = 'REFRESH_TOKEN',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Store an internal app flag if the current user is logged in or not
  public isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private storageService: StorageService, private loggingService: LoggingService) {}

  /**
   * Setup method should always be called from the main `app.component` ngOnInit lifecycle.
   * Verifies if an access token already exists or not.
   * **NOTE** Refresh Token checks can be implemented here aswell :)
   */
  public isAuthenticated(): boolean {
    return this.isLoggedIn.value;
  }
  public async setup(): Promise<void> {
    const accessToken = await this.storageService.get(
      AuthServiceStorageEnum.accessToken
    );
    if (accessToken) {
      this.isLoggedIn.next(true);
    } else {
      this.isLoggedIn.next(false);
    }
  }

  /**
   * The main login method that uses the `OAuth2Client.authenticate` function.
   * The only extension here is that we store the access token, expires in timestamp and the refresh token depending on the platform.
   */
  public async login(): Promise<void> {
    try {
      const response = await OAuth2Client.authenticate(
        this.getAzureB2cOAuth2Options()
      );
      console.log(
        '%c#AUTH-SERVICE# - Login Response',
        'color: orange',
        response
      );

      if (Capacitor.getPlatform() === 'web') {
        const accessToken = response.authorization_response.access_token;
        const expiresIn = response.authorization_response.expires_in;

        await this.storageService.set(
          AuthServiceStorageEnum.accessToken,
          accessToken
        );
        await this.storageService.set(
          AuthServiceStorageEnum.expiresIn,
          expiresIn
        );
      }

      if (Capacitor.getPlatform() === 'ios') {
        // Get the access token from the oauth flow response object
        const accessToken = response.access_token_response.access_token;
        const refreshToken = response.access_token_response.refresh_token;

        // Store the access token in the storage service
        await this.storageService.set(
          AuthServiceStorageEnum.accessToken,
          accessToken
        );
        await this.storageService.set(
          AuthServiceStorageEnum.refreshToken,
          refreshToken
        );
      }

      if (Capacitor.getPlatform() === 'android') {
        // Get the access token from the oauth flow response object
        const accessToken = response.access_token_response.access_token;
        const refreshToken = response.access_token_response.refresh_token;

        // Store the access token in the storage service
        await this.storageService.set(
          AuthServiceStorageEnum.accessToken,
          accessToken
        );
        await this.storageService.set(
          AuthServiceStorageEnum.refreshToken,
          refreshToken
        );
      }

      this.isLoggedIn.next(true);
    } catch (error) {
      console.error('#AUTH-SERVICE# - Login Error', error);
    }
  }

  /**
   * A basic logout flow that calls the b2c endpoints and posts a logout request.
   * **NOTE** Android cant open a browser window with the capacitor browser plugin.
   */
  public async logout(): Promise<void> {
    await this.revokeLoggedInState();

    if (Capacitor.getPlatform() === 'web') {
      // eslint-disable-next-line max-len
      const logoutUrl = `${environment.auth.b2cUrl}/${environment.auth.b2cFlowUrl}/logout?p=${environment.auth.b2cUserFlow}&post_logout_redirect_uri=${environment.auth.web.redirectUrl}`;
      await Browser.open({ url: logoutUrl }).finally(() =>
        setTimeout(() => Browser.close(), 1000)
      );
    }

    if (Capacitor.getPlatform() === 'ios') {
      // eslint-disable-next-line max-len
      const logoutUrl = `${environment.auth.b2cUrl}/${environment.auth.b2cFlowUrl}/logout?p=${environment.auth.b2cUserFlow}&post_logout_redirect_uri=${environment.auth.ios.redirectUrl}`;
      await Browser.open({ url: logoutUrl }).finally(() =>
        setTimeout(() => Browser.close(), 1000)
      );
      return;
    }
    if (Capacitor.getPlatform() === 'android') {
      // Capacitor Browser Plugin does not support `Browser.close` yet.
      // TODO: Need to find a work around for this.
      return;
    }
  }

  /**
   * Helper method that returns the access token which is stored in the storage service
   * @returns Either the access token as string or undefined if no access token is found.
   */
  public async getAccessToken(): Promise<string | undefined> {
    return await this.storageService.get<string>(
      AuthServiceStorageEnum.accessToken
    );
  }

  /**
   * An internal helper that tries to log the user out and rmeoves any internal stored information.
   */
  public async revokeLoggedInState(): Promise<void> {
    await OAuth2Client.logout(this.getAzureB2cOAuth2Options());

    await this.storageService.remove(AuthServiceStorageEnum.accessToken);
    await this.storageService.remove(AuthServiceStorageEnum.expiresIn);
    await this.storageService.remove(AuthServiceStorageEnum.refreshToken);

    this.isLoggedIn.next(false);
  }

  /**
   * Helper that generates the OAuth2AuthenciateOptions Object based on the environment configuration.
   * @returns The OAuth2AuthenticateOptions Object filled with the environment information
   */
  private getAzureB2cOAuth2Options(): OAuth2AuthenticateOptions {
    return {
      appId: environment.auth.appId,
      authorizationBaseUrl: `${environment.auth.b2cUrl}/${environment.auth.b2cFlowUrl}/authorize`,
      scope:
        // eslint-disable-next-line max-len
        'openid offline_access https://ionicsampleorg.onmicrosoft.com/my-custom-api/Files.Write', // See Azure Portal -> API permission
      pkceEnabled: true,
      logsEnabled: true,
      web: {
        responseType: 'token',
        accessTokenEndpoint: '',
        redirectUrl: environment.auth.web.redirectUrl,
        windowOptions: 'height=600,left=0,top=0',
      },
      android: {
        responseType: 'code',
        redirectUrl: environment.auth.android.redirectUrl, // See Azure Portal -> Authentication -> Android Configuration "Redirect URI"
        accessTokenEndpoint: `${environment.auth.b2cUrl}/${environment.auth.b2cFlowUrl}/token`,
      },
      ios: {
        pkceEnabled: true,
        responseType: 'code',
        redirectUrl: `${environment.auth.ios.redirectUrl}`,
        accessTokenEndpoint: `${environment.auth.b2cUrl}/${environment.auth.b2cFlowUrl}/token`,
      },
    };
  }

  /**
   * Returns decoded token inside of an interface token and decodes it logged in state as value (Not as observable) from the BehaviorSubject
   *
   * @returns boolean true or false based on the login state.
   */
  public async getUserInfo(): Promise<UserModel> {
    const idToken = jwtDecode(await this.getAccessToken()|| '{}') as UserInput;
    if (!idToken) {

      this.loggingService.info('#Auth-Service - No idToken found during getUserInfo call');
      return {
        // id: idToken.,
        email:'',
        name: '',
        // firstName: idToken.given_name,
        // lastName: idToken.family_name,
        picture: 'assets/user-placeholder.jpg',
      };
    }

    let email = '';
    if (Array.isArray(idToken.emails)) {
      email = idToken.emails[0];
    }
console.log('token',idToken)
    return {
      // id: idToken.,
      email,
      name: idToken.name,
      // firstName: idToken.given_name,
      // lastName: idToken.family_name,
      picture: 'assets/user-placeholder.jpg',
    };
  }



}



