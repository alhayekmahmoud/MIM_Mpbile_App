// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth: {
    appId: 'bea9a3ec-f9ed-4553-aecc-98d6aa88dc09',
    tenantId: '878d5dbd-1450-4731-b2c4-e9d8be92d1ac',
    b2cUrl: 'https://ionicsampleorg.b2clogin.com/ionicsampleorg.onmicrosoft.com',
    b2cFlowUrl: 'B2C_1_BasicSignInSignUp/oauth2/v2.0',
    b2cUserFlow: 'B2C_1_BasicSignInSignUp',
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
