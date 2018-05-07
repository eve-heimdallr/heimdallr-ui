import 'jquery';
import 'bootstrap-sass';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

//import { AppModule } from './app/app.module';

// depending on the env mode, enable prod mode or add debugging modules
if (['prod', 'deploy'].indexOf(process.env.ENV) > -1) {
  enableProdMode();
}

export function main() {
  require('style-loader!./vendor-styles.scss');
  console.log('hello');
  //return platformBrowserDynamic().bootstrapModule(AppModule);
}

if (document.readyState === 'complete') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
