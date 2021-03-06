
var Test = require('segmentio-integration-tester');
var helpers = require('../../../test/helpers');
var facade = require('segmentio-facade');
var assert = require('assert');
var should = require('should');
var Lytics = require('..');

describe('Lytics', function(){
  var settings;
  var lytics;
  var test;

  beforeEach(function(){
    lytics = new Lytics;
    test = Test(lytics, __dirname);
    settings = {
      apiKey: 'LPv7adzJu8IhRMTbgWmaagxx',
      cid: 1289
    };
  });

  it('should have the correct settings', function(){
    test
      .name('Lytics')
      .endpoint('https://c.lytics.io/c')
      .retries(2);
  });

  describe('.enabled()', function(){
    it('should only be enabled for server side messages', function(){
      test.enabled(new facade.Track({ channel : 'server' }));
      test.disabled(new facade.Track({ channel : 'client' }));
      test.disabled(new facade.Track({}));
    });
  });

  describe('.validate()', function(){
    it('should require a cid', function(){
      test.invalid({}, { apiKey: 'x', cid: '' });
      test.invalid({}, { apiKey: 'x' });
      test.valid({}, { apiKey: 'x', cid: 'x' });
    });

    it('should require an apiKey', function(){
      test.invalid({}, { cid: 'x', apiKey: '' });
      test.invalid({}, { cid: 'x' });
      test.valid({}, { apiKey: 'x', cid: 'x' });
    });
  });

  describe('.track()', function(){
    it('should track successfully', function(done){
      var track = helpers.track();
      var json = track.json();

      json.options = json.options || json.context;
      delete json.context;
      delete json.projectId;

      test
        .set(settings)
        .track(track)
        .query({ access_token: settings.apiKey })
        .sends(json)
        .requests(1)
        .expects(200)
        .end(done);
    });
  });

  describe('.identify()', function(){
    it('should identify successfully', function(done){
      var identify = helpers.identify();
      var json = identify.json();

      json.options = json.options || json.context;
      delete json.context;
      delete json.projectId;

      test
        .set(settings)
        .identify(identify)
        .query({ access_token: settings.apiKey })
        .sends(json)
        .requests(1)
        .expects(200)
        .end(done);
    });
  });

  describe('.alias()', function(){
    it('should alias successfully', function(done){
      var alias = helpers.alias();
      var json = alias.json();

      json.options = json.options || json.context;
      delete json.context;
      delete json.projectId;

      test
        .set(settings)
        .alias(alias)
        .query({ access_token: settings.apiKey })
        .sends(json)
        .requests(1)
        .expects(200)
        .end(done);
    });
  });
});
