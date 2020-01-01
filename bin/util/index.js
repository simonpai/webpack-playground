function promisify(fn) {
  return function() {
    var self = this; // eslint-disable-line no-invalid-this
    var args = Array.prototype.slice.call(arguments);
    return new Promise((resolve, reject) => {
      fn.apply(self, args.concat((err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      }));
    });
  };
}

function percent(value) {
  return Math.round(100 * value); // eslint-disable-line no-magic-numbers
}

module.exports = {
  promisify: promisify,
  percent: percent
};
