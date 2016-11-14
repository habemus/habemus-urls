// native
const url = require('url');

// own
const aux     = require('../aux');
const prodFmt = require('../format');

/**
 * Formats the url for accessing the workspace of a given projectCode
 * 
 * @param  {Object} options
 *         - uiWorkspaceBaseURL
 * @param  {Object} projectCode
 * @return {String}
 */
exports.uiWorkspace = function (options, projectCode) {
  if (!options.uiWorkspaceBaseURL) {
    throw new Error('uiWorkspaceBaseURL is required');
  }

  return aux.trimTrailingSlash(options.uiWorkspaceBaseURL) + '?code=' + projectCode;
};

exports.uiDashboard = function (options) {
  throw new Error('not implemented');
};

/**
 * Formats the url for previewing a workspace's files.
 * 
 * @param  {Object} options
 *         - hWorkspaceServerURI
 *         - workspacePreviewHost
 * @param  {String} projectCode
 * @return {String}
 */
exports.workspacePreview = function (options, projectCode) {
  if (!options.hWorkspaceServerURI) {
    throw new Error('hWorkspaceServerURI is required');
  }

  if (!projectCode) {
    throw new Error('projectCode is required');
  }

  hWorkspaceServerURI = aux.trimTrailingSlash(options.hWorkspaceServerURI);

  var domain = aux.trimHTTP(prodFmt.workspacePreview(options, projectCode));

  return hWorkspaceServerURI + '/workspace/' + domain;
};

/**
 * Formats the url for accessing the hosted website of a given
 * projectCode, optionally at a given versionCode
 * 
 * @param  {Object} options
 *         - websiteHost
 *         - hWebsiteServerURI
 * @param  {String} projectCode
 * @param  {String} versionCode
 * @return {String}
 */
exports.websiteHabemusDomain = function (options, projectCode, versionCode) {
  if (!options.hWebsiteServerURI) {
    throw new Error('hWebsiteServerURI is required');
  }

  if (!projectCode) {
    throw new Error('projectCode is required');
  }

  var domain = prodFmt.websiteHabemusDomain(options, projectCode, versionCode, {
    domainOnly: true
  });

  // to see how node.js url format works:
  // https://nodejs.org/api/url.html#url_url_format_urlobject

  // return the formatted url
  return aux.trimTrailingSlash(options.hWebsiteServerURI) + '/website/' + domain;
};

exports.websiteCustomDomain = function (options, domain) {

  if (!options.hWebsiteServerURI) {
    throw new Error('hWebsiteServerURI is required');
  }

  if (!domain) {
    throw new Error('domain is required');
  }

  domain = aux.trimHTTP(domain);

  return aux.trimTrailingSlash(options.hWebsiteServerURI) + '/website/' + domain;
};
