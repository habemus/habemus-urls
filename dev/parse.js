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

  var projectCode = aux.trimPrefix(
    aux.ensureHTTP(aux.trimTrailingSlash(options.hWorkspaceServerURI)) + '/workspace/',
    aux.ensureHTTP(srcURL)
  );

  projectCode = aux.trimTrailingSlash(projectCode);

  return {
    projectCode: projectCode,
  };
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
exports.websiteHabemusDomain = function (options, srcURL) {
  if (!options.hWebsiteServerURI) {
    throw new Error('hWebsiteServerURI is required');
  }

  if (!srcURL) {
    throw new Error('srcURL is required');
  }

  var domain = aux.trimPrefix(
    aux.ensureHTTP(aux.trimTrailingSlash(options.hWebsiteServerURI)) + '/website/',
    aux.ensureHTTP(aux.trimTrailingSlash(srcURL))
  );

  return prodParse.websiteHabemusDomain(options, domain);
};

// exports.websiteCustomDomain = function (options, domain, formatOptions) {

//   if (!domain) {
//     throw new Error('domain is required');
//   }

//   formatOptions = formatOptions || {};

//   return formatOptions.domainOnly ? aux.trimHTTP(domain) : aux.ensureHTTP(domain);
// };
