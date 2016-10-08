// native
const url = require('url');

// own
const aux = require('./aux');


/**
 * Parses the projectCode out of a given url
 * 
 * @param  {Object} options
 *         - workspaceHost
 * @param  {String} srcURL
 * @return {Object}
 */
exports.workspace = function (options, srcURL) {
  if (!options.workspaceHost) {
    throw new Error('workspaceHost is required');
  }

  if (!srcURL) {
    throw new Error('srcURL is required');
  }

  var match = aux.matchPrefix(
    aux.trimHTTP(aux.trimTrailingSlash(options.workspaceHost)) + '/workspace/',
    aux.trimHTTP(srcURL)
  );

  return {
    projectCode: match ? match[1] : null,
  };
};

/**
 * Parses the projectCode out of the given url
 * 
 * @param  {Object} options
 *         - workspacePreviewHost
 * @param  {String} srcURL
 * @return {String}
 */
exports.workspacePreview = function (options, srcURL) {
  if (!options.workspacePreviewHost) {
    throw new Error('workspacePreviewHost is required');
  }

  var match = aux.matchSuffix(
    '.' + aux.trimHTTP(aux.trimTrailingSlash(options.workspacePreviewHost)),
    aux.trimHTTP(aux.trimTrailingSlash(srcURL))
  );

  return {
    projectCode: match ? match[1] : null
  };
};


/**
 * Parses the projectCode and versionCode out of a given url
 * 
 * @param  {Object} options
 *         - websiteHost
 * @param  {String} srcURL
 * @return {String}
 */
exports.websiteHabemusDomain = function (options, srcURL) {
  if (!options.websiteHost) {
    throw new Error('websiteHost is required');
  }

  if (!srcURL) {
    throw new Error('srcURL is required');
  }

  var projectCode;
  var versionCode;

  // retrieve the string that has the versionCode and projectCode
  // candidates
  var match = aux.matchSuffix(
    '.' + aux.trimHTTP(aux.trimTrailingSlash(options.websiteHost)),
    aux.trimHTTP(aux.trimTrailingSlash(srcURL))
  );

  var dataString = match ? match[1] : null;

  if (!dataString) {
    projectCode = null;
    versionCode = null;
  } else {
    var split = dataString.split('.');

    if (split.length === 2) {
      // version and project
      versionCode = split[0];
      projectCode = split[1];

    } else if (split.length === 1) {
      // project only
      versionCode = null;
      projectCode = split[0];

    } else {
      // does not match anything
      versionCode = null;
      projectCode = null;
    }
  }

  return {
    projectCode: projectCode,
    versionCode: versionCode,
  };
};
