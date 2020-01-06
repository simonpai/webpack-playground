require('./a');
require('./b');

var locales = require('./locale');

console.log(locales.keys());
console.log(locales('./en.json'));

var animal = require('./animal');
console.log(animal.keys());
console.log(animal(animal.keys()[0]));
