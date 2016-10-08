const should = require('should');

const urls    = require('../');
const urlsDev = require('../dev');

describe('h-urls format', function () {

  var prodURLs;
  var devURLs;

  beforeEach(function () {
    prodURLs = urls({
      workspacePreviewHost: 'habemus.io',
      workspaceHost: 'habem.us',
      websiteHost: 'habemus.website',
    });

    devURLs = urlsDev({
      workspacePreviewHost: 'habemus.io',
      workspaceHost: 'habem.us',
      websiteHost: 'habemus.website',

      // required only for dev urls
      hWorkspaceUIServerURI: 'http://localhost:3000',
      hWorkspaceServerURI: 'http://localhost:9000/api/h-workspace-server/public',
      hWebsiteServerURI: 'http://localhost:9000/api/h-website-server/public',
    });
  });

  describe('workspace(projectCode)', function () {
    it('prod: http://{{ workspaceHost }}/workspaces/{{ projectCode }}', function () {
      prodURLs.format.workspace('my-project')
        .should.eql('http://habem.us/workspace/my-project');
    });

    it('dev: http://{{ hWorkspaceUIServerURI }}?code={{ projectCode }}', function () {
      devURLs.format.workspace('my-project')
        .should.eql('http://localhost:3000?code=my-project');
    });
  });

  describe('workspacePreview(projectCode)', function () {

    it('prod: http://{{ projectCode }}.{{ workspacePreviewHost }}', function () {
      prodURLs.format.workspacePreview('my-project')
        .should.eql('http://my-project.habemus.io');
    });

    it('dev: http://{{ hWorkspaceServerURI }}/workspace/{{ projectCode }}', function () {
      devURLs.format.workspacePreview('my-project')
        .should.eql('http://localhost:9000/api/h-workspace-server/public/workspace/my-project');
    });

  });

  describe('websiteHabemusDomain(projectCode, null)', function () {
    it('prod: http://{{ projectCode }}.{{ websiteHost }}', function () {
      prodURLs.format.websiteHabemusDomain('my-project')
        .should.eql('http://my-project.habemus.website');
    });

    it('dev: http://{{ hWebsiteServerURI }}/website/{{ projectCode }}.{{ websiteHost }}', function () {
      devURLs.format.websiteHabemusDomain('my-project')
        .should.eql(
          'http://localhost:9000/api/h-website-server/public/website/' + 
          'my-project.habemus.website');
    });
  });

  describe('websiteHabemusDomain(projectCode, versionCode)', function () {
    it('prod: http://{{ versionCode }}.{{ projectCode }}.{{ websiteHost }}', function () {
      prodURLs.format.websiteHabemusDomain('my-project', 'v1')
        .should.eql('http://v1.my-project.habemus.website');
    });

    it('dev: http://{{ hWebsiteServerURI }}/website/{{ versionCode }}.{{ projectCode }}.{{ websiteHost }}', function () {
      devURLs.format.websiteHabemusDomain('my-project', 'v1')
        .should.eql(
          'http://localhost:9000/api/h-website-server/public/website/' + 
          'v1.my-project.habemus.website');
    });
  });

  describe('websiteHabemusDomain(projectCode, versionCode, formatOptions)', function () {
    it('prod: should allow formatting without the http', function () {
      prodURLs.format.websiteHabemusDomain('my-project', 'v1', { domainOnly: true })
        .should.eql('v1.my-project.habemus.website');
    });
  });

  describe('websiteCustomDomain(domain)', function () {
    it('prod: http://{{ domain }}', function () {
      prodURLs.format.websiteCustomDomain('my-custom-domain.org')
        .should.eql('http://my-custom-domain.org');
    });

    it('dev: http://{{ hWebsiteServerURI }}/website/{{ domain }}', function () {
      devURLs.format.websiteCustomDomain('my-custom-domain.org')
        .should.eql(
          'http://localhost:9000/api/h-website-server/public/website/' +
          'my-custom-domain.org')
    });
  });

  describe('websiteCustomDomain(domain, formatOptions)', function () {
    it('prod: should allow retrieving only the domain', function () {
      prodURLs.format.websiteCustomDomain('http://my-custom-domain.org', { domainOnly: true })
        .should.eql('my-custom-domain.org');
    });
  });
});
