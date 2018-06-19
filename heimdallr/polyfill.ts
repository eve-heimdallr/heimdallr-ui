import 'core-js';
import 'core-js/es7/reflect';
import 'reflect-metadata';
import 'zone.js/dist/zone';

if (['prod', 'deploy'].indexOf(process.env.ENV) > -1) {
  // Production

} else {
  // Development

  Error['stackTraceLimit'] = Infinity;

  require('zone.js/dist/long-stack-trace-zone');
}

console.log('injected polyfills');