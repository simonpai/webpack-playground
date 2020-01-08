var locales = require.context('./locale', true, /\.json$/);
console.log(locales.keys());
console.log(locales.keys().map(locales));

var animal = require.context('null-loader!./animal', true, /\.sub.js$/);
console.log(animal.keys());
console.log(animal.keys().map(animal));