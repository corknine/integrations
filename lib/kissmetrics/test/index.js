
var Test = require('segmentio-integration-tester');
var helpers = require('../../../test/helpers');
var facade = require('segmentio-facade');
var KISSmetrics = require('..');
var should = require('should');
var assert = require('assert');

describe('KISSmetrics', function () {
  var kissmetrics;
  var settings;
  var test;

  beforeEach(function(){
    kissmetrics = new KISSmetrics;
    test = Test(kissmetrics, __dirname);
    settings = { apiKey: '2b93bdf937c54fc7da2b5c6015c273bf3919c273' };
  });

  it('should have correct settings', function(){
    test
      .name('KISSmetrics')
      .endpoint('https://trk.kissmetrics.com')
      .retries(2);
  });

  describe('.enabled()', function () {
    it('should be enabled for server side messages', function(){
      test.enabled({
        channel: 'server'
      });
    });

    it('should be disabled for other channels', function(){
      test.disabled({ channel: 'client' });
      test.disabled({ channel: 'mobile' });
      test.disabled({ channel: '' });
    });
  });

  describe('.validate()', function () {
    it('should be invalid when .apiKey is missing', function(){
      delete settings.apiKey;
      test.invalid({}, settings);
    });

    it('should be valid when settings are complete', function(){
      test.valid({}, settings);
    });
  });

  describe('mapper', function(){
    describe('identify', function(){
      it('should map basic identify', function(){
        test.maps('identify-basic', settings);
      });

      it('should contain .alias if .userId and .anonymousId are given', function(){
        test.maps('identify-alias', settings);
      });

      it('should clean and stringify objects', function(){
        test.maps('identify-clean', settings);
      });
    });

    describe('track', function(){
      it('should map basic track', function(){
        test.maps('track-basic', settings);
      });

      it('should prefix properties if `.prefixProperties` is true', function(){
        settings.prefixProperties = true;
        test.maps('track-prefix', settings);
      });
    });

    describe('alias', function(){
      it('should map basic alias', function(){
        test.maps('alias-basic', settings);
      });
    });
  });

  describe('.track()', function () {
    var track = helpers.track();
    it('should be able to track correctly', function(done){
      kissmetrics.track(track, settings, done);
    });

    it('should prefix event properties if prefixProperties is enabled', function(){
      var result = kissmetrics.mapper.track(track, { prefixProperties: true });
      result['Baked a cake - layers'].should.eql('chocolate,strawberry,fudge');
      result['Billing Amount'].should.eql(19.95);
      result._n.should.eql('Baked a cake');
    });

    it('should not prefix event properties if prefixProperties is disabled', function(){
      var result = kissmetrics.mapper.track(track, {});
      result['layers'].should.eql('chocolate,strawberry,fudge');
      result['Billing Amount'].should.eql(19.95);
      result._n.should.eql('Baked a cake');
    });
  });

  describe('.identify()', function () {
    var identify = helpers.identify();
    it('should be able to identify correctly', function(done){
      kissmetrics.identify(identify, settings, done);
    });
  });

  describe('.alias()', function () {
    var alias = helpers.alias();
    it('should be able to alias properly', function(done){
      kissmetrics.alias(alias, settings, done);
    });
  });
});
