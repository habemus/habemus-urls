// native
const url = require('url');

// own
const aux = require('../aux');

const prodParse = require('../parse');


/**
 * Parses the projectCode out of a given url
 * 
 * @param  {Object} options
 * @param  {String} srcURL
 * @return {String}
 */
exports.workspace = function (options, srcURL) {
  if (!srcURL) {
    throw new Error('srcURL is required');
  }

  var parsed = url.parse(srcURL, true);

  return {
    projectCode: parsed.query.code,
  };
};

/**
 * Parses the projectCode out of a given url
 * 
 * @param  {Object} options
 *         - hWorkspaceServerURI
 * @param  {String} projectCode
 * @return {String}
 */
exports.workspacePreview = function (options, srcURL) {
  if (!options.hWorkspaceServerURI) {
    throw new Error('hWorkspaceServerURI is required');
  }

  var prefixMatchRes = aux.matchPrefix(
    aux.trimHTTP(aux.trimTrailingSlash(options.hWorkspaceServerURI)) + '/workspace/',
    aux.trimHTTP(srcURL)
  );

  if (!prefixMatchRes) {
    return {
      projectCode: null
    };
  } else {
    var matchRes = aux.trimTrailingSlash(prefixMatchRes[1]);
    // domain is always the first part
    var domain = matchRes.split('/')[0];

    return prodParse.workspacePreview(options, domain);
  }
};


/**
 * Parses the projectCode and versionCode out of an habemus url
 * 
 * @param  {Object} options
 *         - websiteHost
 *         - hWebsiteServerURI
 * @param  {String} srcURL
 * @return {String}
 */
exports.websiteHabemusDomain = function (options, srcURL, parseOptions) {
  if (!options.hWebsiteServerURI) {
    throw new Error('hWebsiteServerURI is required');
  }

  if (!srcURL) {
    throw new Error('srcURL is required');
  }

  parseOptions = parseOptions || {};
  var domainOnly = parseOptions.domainOnly || false;

  if (domainOnly) {
    return prodParse.websiteHabemusDomain(options, srcURL);

  } else {

    var match = aux.matchPrefix(
      aux.trimHTTP(aux.trimTrailingSlash(options.hWebsiteServerURI)) + '/website/',
      aux.trimHTTP(aux.trimTrailingSlash(srcURL))
    );

    var domain = match ? match[1] : null;

    if (!domain) {
      return {
        projectCode: null,
        versionCode: null,
      };
    } else {
      return prodParse.websiteHabemusDomain(options, domain);
    }
  }
};
