
var Test = require('segmentio-integration-tester');
var helpers = require('../../../test/helpers');
var facade = require('segmentio-facade');
var Attribution = require('..');
var should = require('should');
var assert = require('assert');

describe('Attribution', function () {
  var attribution;
  var settings;
  var test;

  beforeEach(function(){
    attribution = new Attribution;
    test = Test(attribution, __dirname);
    settings = { projectId: '11710-asdfq-1234-xdrd' };
  });

  it('should have correct settings', function(){
    test
      .name('Attribution')
      .endpoint('https://track.attributionapp.com')
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
    it('should be invalid when .projectId is missing', function(){
      delete settings.projectId;
      test.invalid({}, settings);
    });

    it('should be valid when settings are complete', function(){
      test.valid({}, settings);
    });
  });

  describe('mapper', function(){
    describe('identify', function(){
      it('should map basic identify', function(){
        test.maps('identify', settings);
      });
    });

    describe('track', function(){
      it('should map basic track', function(){
        test.maps('track', settings);
      });
    });
  });

  describe('.track()', function () {
    var track = helpers.track();
    it('should be able to track correctly', function(done){
      attribution.track(track, settings, done);
    });
  });

  describe('.identify()', function () {
    var identify = helpers.identify();
    it('should be able to identify correctly', function(done){
      attribution.identify(identify, settings, done);
    });
  });
});
