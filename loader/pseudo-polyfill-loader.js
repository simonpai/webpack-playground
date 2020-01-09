module.exports = function(source) {
  return source.indexOf('Promise') < 0 ? source : ('var Promise = require(\'promise\');\n' + source);
};