// native
const url = require('url');

// own
const aux = require('./aux');


/**
 * Formats the url for accessing the workspace of a given projectCode
 * 
 * @param  {Object} options
 *         - workspaceHost
 * @param  {Object} projectCode
 * @return {String}
 */
exports.workspace = function (options, projectCode) {
  if (!options.workspaceHost) {
    throw new Error('workspaceHost is required');
  }

  if (!projectCode) {
    throw new Error('projectCode is required');
  }

  var res = aux.trimTrailingSlash(options.workspaceHost);
  res = aux.ensureHTTP(res);

  return res + '/workspace/' + projectCode;
};

/**
 * Formats the url for previewing a workspace's files.
 * 
 * @param  {Object} options
 *         - workspacePreviewHost
 * @param  {String} projectCode
 * @return {String}
 */
exports.workspacePreview = function (options, projectCode) {
  if (!options.workspacePreviewHost) {
    throw new Error('workspacePreviewHost is required');
  }

  var host = aux.ensureHTTP(options.workspacePreviewHost);

  var parsed = url.parse(host);
  
  // modify the host by adding a subdomain equivalent to the
  // projectCode
  parsed.host = projectCode + '.' + parsed.host;

  // to see how node.js url format works:
  // https://nodejs.org/api/url.html#url_url_format_urlobject

  // return the formatted url
  return aux.trimTrailingSlash(url.format(parsed));
};


/**
 * Formats the url for accessing the hosted website of a given
 * projectCode, optionally at a given versionCode
 * 
 * @param  {Object} options
 *         - websiteHost
 * @param  {String} projectCode
 * @param  {String} versionCode
 * @return {String}
 */
exports.websiteHabemusDomain = function (options, projectCode, versionCode, formatOptions) {
  if (!options.websiteHost) {
    throw new Error('websiteHost is required');
  }

  if (!projectCode) {
    throw new Error('projectCode is required');
  }

  formatOptions = formatOptions || {};

  var domainOnly = formatOptions.domainOnly || false;

  var host;
  var res;

  if (domainOnly) {

    host = aux.trimHTTP(options.websiteHost);

    res = projectCode + '.' + host;

    if (versionCode) {
      res = versionCode + '.' + res;
    }

  } else {

    host = aux.ensureHTTP(options.websiteHost);

    var parsed = url.parse(host);
    
    // modify the host by adding a subdomain equivalent to the
    // projectCode
    parsed.host = projectCode + '.' + parsed.host;

    if (versionCode) {
      parsed.host = versionCode + '.' + parsed.host;
    }

    // to see how node.js url format works:
    // https://nodejs.org/api/url.html#url_url_format_urlobject
    res = url.format(parsed);
  }

  return aux.trimTrailingSlash(res);
};

exports.websiteCustomDomain = function (options, domain, formatOptions) {

  if (!domain) {
    throw new Error('domain is required');
  }

  formatOptions = formatOptions || {};

  return formatOptions.domainOnly ? aux.trimHTTP(domain) : aux.ensureHTTP(domain);
};
