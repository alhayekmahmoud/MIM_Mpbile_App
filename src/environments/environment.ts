// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import { IonicAuthOptions } from '@ionic-enterprise/auth';




export const environment = {
  production: false,
  auth: {
    appId: 'a31245f6-25ea-429a-9f06-83ce6948d344',
    tenantId: '59c20810-b558-4374-be30-0ad7a36f064b',
    b2cUrl: 'https://mimappb2c.b2clogin.com/mimappb2c.onmicrosoft.com',
    b2cFlowUrl: 'B2C_1_MIM_B2C_SignInSignUp/oauth2/v2.0',
    b2cUserFlow: 'B2C_1_MIM_B2C_SignInSignUp',
    ios: {
      redirectUrl: 'msauth.com.planb.ionic-sample-app://auth',
    },
    android: {
      redirectUrl: 'msauth://com.planb.ionic_sample_app/gYfucgrOlZ3FLWgYctqk1bCxZbo%3D',
    },
    web: {
      redirectUrl: 'http://localhost:8100/',
    },
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
