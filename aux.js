const TRAILING_SLASH_RE = /\/$/;
const LEADING_SLASH_RE  = /^\//;
const HTTP_PROTOCOL_RE = /^https?:\/\//;

exports.TRAILING_SLASH_RE = TRAILING_SLASH_RE;
exports.LEADING_SLASH_RE = LEADING_SLASH_RE;

exports.trimTrailingSlash = function (str) {
  return str.replace(TRAILING_SLASH_RE, '');
};

exports.HTTP_PROTOCOL_RE = HTTP_PROTOCOL_RE;

exports.hasHTTP = function (str) {
  return HTTP_PROTOCOL_RE.test(str);
};

exports.trimHTTP = function (str) {
  return str.replace(HTTP_PROTOCOL_RE, '');
};

exports.ensureHTTP = function (str) {
  return HTTP_PROTOCOL_RE.test(str) ? str : 'http://' + str;
};

exports.prefixRegExp = function (str) {
  return new RegExp('^' + str + '(.*)$');
};

exports.matchPrefix = function (prefix, str) {
  return str.match(exports.prefixRegExp(prefix), '');
};

exports.suffixRegExp = function (str) {
  return new RegExp('^(.*?)' + str + '$');
};

exports.matchSuffix = function (suffix, str) {
  return str.match(exports.suffixRegExp(suffix), '');
};

exports.curryAll = function (obj, options) {

  var res = {};

  for (var prop in obj) {
    if (typeof obj[prop] === 'function') {
      res[prop] = obj[prop].bind(null, options);
    }
  }

  return res;
}