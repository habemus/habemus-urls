const should = require('should');

const urls    = require('../');
const urlsDev = require('../dev');

describe('h-urls', function () {

  var prodURLs;
  var devURLs;

  beforeEach(function () {
    prodURLs = urls({
      workspacePreviewHost: 'habemus.io',
      websiteHost: 'habemus.website',
      uiWorkspaceBaseURL: 'http://habem.us',
    });

    devURLs = urlsDev({
      workspacePreviewHost: 'habemus.io',
      websiteHost: 'habemus.website',
      uiWorkspaceBaseURL: 'http://localhost:3000',

      // required only for dev urls
      hWorkspaceServerURI: 'http://localhost:9000/api/h-workspace-server/public',
      hWebsiteServerURI: 'http://localhost:9000/api/h-website-server/public',
    });
  });

  describe('format.uiWorkspace(projectCode), parse.uiWorkspace(srcURL)', function () {
    it('prod: http://{{ uiWorkspaceBaseURL }}/workspaces/{{ projectCode }}', function () {

      var resURL = prodURLs.format.uiWorkspace('my-project');
      resURL.should.eql('http://habem.us/workspace/my-project');

      var parsed = prodURLs.parse.uiWorkspace(resURL);
      parsed.should.eql({
        projectCode: 'my-project',
      });
    });

    it('dev: http://{{ uiWorkspaceURI }}?code={{ projectCode }}', function () {
      var resURL = devURLs.format.uiWorkspace('my-project');
      resURL.should.eql('http://localhost:3000?code=my-project');

      var parsed = devURLs.parse.uiWorkspace(resURL);
      parsed.should.eql({
        projectCode: 'my-project',
      });
    });
  });

  describe('format.workspacePreview(projectCode), parse.workspacePreview(srcURL)', function () {

    it('prod: http://{{ projectCode }}.{{ workspacePreviewHost }}', function () {
      var resURL = prodURLs.format.workspacePreview('my-project');
      resURL.should.eql('http://my-project.habemus.io');

      var parsed = prodURLs.parse.workspacePreview(resURL);
      parsed.should.eql({
        projectCode: 'my-project',
      });
    });

    it('prod: http://{{ projectCode }}.{{ workspacePreviewHost }}/somedir/somefile.html', function () {
      var resURL = prodURLs.format.workspacePreview('my-project') + '/somedir/somefile.html';
      resURL.should.eql('http://my-project.habemus.io/somedir/somefile.html');

      var parsed = prodURLs.parse.workspacePreview(resURL);
      parsed.should.eql({
        projectCode: 'my-project',
      });
    });

    it('dev: http://{{ hWorkspaceServerURI }}/workspace/{{ projectCode }}.{{ workspacePreviewHost }}', function () {
      var resURL = devURLs.format.workspacePreview('my-project');
      resURL.should.eql('http://localhost:9000/api/h-workspace-server/public/workspace/my-project.habemus.io');

      devURLs.parse.workspacePreview(resURL).should.eql({
        projectCode: 'my-project'
      });

      // add some complexity
      devURLs.parse.workspacePreview(resURL + '/index.html').should.eql({
        projectCode: 'my-project'
      })
    });

    it('prod: parse should return nulls upon a url that does not match the pattern', function () {

      var parsed = prodURLs.parse.workspacePreview('http://google.com');
      parsed.should.eql({
        projectCode: null
      });
    });

  });

  describe('format.websiteHabemusDomain(projectCode, null), parse.websiteHabemusDomain("my-project.habemus.website")', function () {
    it('prod: http://{{ projectCode }}.{{ websiteHost }}', function () {
      var resURL = prodURLs.format.websiteHabemusDomain('my-project');
      resURL.should.eql('http://my-project.habemus.website');

      var parsed = prodURLs.parse.websiteHabemusDomain(resURL);
      parsed.should.eql({
        projectCode: 'my-project',
        versionCode: null,
      });
    });

    it('dev: http://{{ hWebsiteServerURI }}/website/{{ projectCode }}.{{ websiteHost }}', function () {
      var resURL = devURLs.format.websiteHabemusDomain('my-project');
      resURL.should.eql(
          'http://localhost:9000/api/h-website-server/public/website/' + 
          'my-project.habemus.website');

      var parsed = devURLs.parse.websiteHabemusDomain(resURL);
      parsed.should.eql({
        projectCode: 'my-project',
        versionCode: null,
      });
    });
  });

  describe('websiteHabemusDomain(projectCode, versionCode)', function () {
    it('prod: http://{{ versionCode }}.{{ projectCode }}.{{ websiteHost }}', function () {
      var resURL = prodURLs.format.websiteHabemusDomain('my-project', 'v1');
      resURL.should.eql('http://v1.my-project.habemus.website');

      var parsed = prodURLs.parse.websiteHabemusDomain(resURL);
      parsed.should.eql({
        projectCode: 'my-project',
        versionCode: 'v1'
      });
    });

    it('dev: http://{{ hWebsiteServerURI }}/website/{{ versionCode }}.{{ projectCode }}.{{ websiteHost }}', function () {
      var resURL = devURLs.format.websiteHabemusDomain('my-project', 'v1');
      resURL.should.eql(
          'http://localhost:9000/api/h-website-server/public/website/' + 
          'v1.my-project.habemus.website');

      var parsed = devURLs.parse.websiteHabemusDomain(resURL);
      parsed.should.eql({
        projectCode: 'my-project',
        versionCode: 'v1'
      });
    });
  });

  describe('format.websiteHabemusDomain(projectCode, versionCode, formatOptions)', function () {
    it('prod: should allow formatting without the http', function () {
      prodURLs.format.websiteHabemusDomain('my-project', 'v1', { domainOnly: true })
        .should.eql('v1.my-project.habemus.website');
    });
  });

  describe('parse.websiteHabemusDomain(projectCode, versionCode, formatOptions)', function () {
    it('dev: should allow parsing only the domain', function () {
      devURLs.parse.websiteHabemusDomain('v1.my-project.habemus.website', { domainOnly: true })
        .should.eql({
          projectCode: 'my-project',
          versionCode: 'v1',
        });
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
