// aux
const aux = require('../aux');

/**
 * Creates a curried version of all hURLsDev methods.
 * 
 * @param  {Object} options
 * @return {Object}
 */
var hURLsDev = function (options) {
  return {
    format: aux.curryAll(require('./format'), options),
    parse: aux.curryAll(require('./parse'), options),
  };
};

module.exports = hURLsDev;
