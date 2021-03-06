// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  envName: "dev",
  baseUrl: "https://api-dev.serverlessperformance.net",
  aws_runtimes: ['java8', 'java11', 'ruby25', 'ruby27', 'python36', 'python38', 'go', 'dotnet21', 'nodejs12x', 'nodejs10x'], 
  azure_runtimes: ['dotnet31csx', 'nodejs12x', 'nodejs10x'] 
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
