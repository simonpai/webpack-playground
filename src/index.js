// regular require.context()
var locales = require.context('./locale', true, /\.json$/);
console.log(locales.keys());
console.log(locales.keys().map(locales));

// require.context() with null-loader
var animal = require.context('null-loader!./animal', true, /\.sub.js$/);
console.log(animal.keys());
console.log(animal.keys().map(animal));

// pseudo-polyfill promise
console.log(window.Promise);
console.log(Promise);