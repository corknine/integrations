
var Test = require('segmentio-integration-tester');
var helpers = require('../../../test/helpers');
var facade = require('segmentio-facade');
var mapper = require('../mapper');
var should = require('should');
var assert = require('assert');
var Outbound = require('..');

describe('Outbound', function () {
  var outbound;
  var settings;
  var test;

  beforeEach(function(){
    outbound = new Outbound;
    test = Test(outbound, __dirname);
    settings = { apiKey: '950a9fc29b1d65815f4aec077944600a' };
  });

  it('should have correct settings', function(){
    test
      .name('Outbound')
      .endpoint('https://api.outbound.io')
      .retries(2);
  });

  it('should use the mapper', function(){
    assert.equal(outbound.mapper, mapper);
  });

  describe('.enabled()', function(){
    it('should be disabled everywhere without a userId', function(){
      test.disabled(new facade.Track({ channel : 'server' }));
      test.disabled(new facade.Track({ channel : 'client' }));
      test.disabled(new facade.Track({}));
    });

    it('should be enabled everywhere with a userId', function(){
      test.enabled(new facade.Track({ channel : 'server', userId: 'xxx' }));
      test.enabled(new facade.Track({ channel : 'client', userId: 'xxx' }));
      test.enabled(new facade.Track({ userId: 'xxx' }));
    });
  });

  describe('.validate()', function(){
    it('should require an api key', function(){
      test.invalid({}, {});
      test.invalid({}, { apiKey : '' });
      test.valid({}, { apiKey : 'xxx' });
    });
  });

  describe('.track()', function(){
    it('should track successfully', function(done){
      var track = helpers.track();
      test
        .set(settings)
        .track(track)
        .sends({
          user_id: track.userId(),
          event: track.event(),
          properties: track.properties()
        })
        .expects(200)
        .end(done);
    });
  });

  describe('.identify()', function(){
    it('should identify successfully', function(done){
      var identify = helpers.identify();
      test
        .set(settings)
        .identify(identify)
        .sends({
          user_id: identify.userId(),
          attributes: identify.traits(),
          phone_number: identify.phone(),
          last_name: identify.lastName(),
          first_name: identify.firstName(),
          email: identify.email()
        })
        .expects(200)
        .end(done);
    });

    it('should identify with an android device token', function(done){
      var identify = helpers.identify({ context : {
        library : {
          name: 'analytics-android',
          version: '0.6.2'
        },
        device : {
          token: 'asdfasdf'
        }
      }});
      test
        .set(settings)
        .identify(identify)
        .sends({
          user_id: identify.userId(),
          attributes: identify.traits(),
          phone_number: identify.phone(),
          last_name: identify.lastName(),
          first_name: identify.firstName(),
          email: identify.email(),
          gcm: ['asdfasdf']
        })
        .expects(200)
        .end(done);
    });

    it('should identify with an ios device token', function(done){
      var identify = helpers.identify({ context : {
        library : {
          name: 'analytics-ios',
          version: '0.6.2'
        },
        device : {
          token: 'asdfasdf'
        }
      }});
      test
        .set(settings)
        .identify(identify)
        .sends({
          user_id: identify.userId(),
          attributes: identify.traits(),
          phone_number: identify.phone(),
          last_name: identify.lastName(),
          first_name: identify.firstName(),
          email: identify.email(),
          apns: ['asdfasdf']
        })
        .expects(200)
        .end(done);
    });
  });


  describe('.alias()', function(){
    it('should do nothing', function(done){
      var alias = helpers.alias();
      test
        .set(settings)
        .alias(alias)
        .requests(0)
        .end(done);
    });
  });

  describe('.group()', function(){
    it('should do nothing', function(done){
      var group = helpers.group();
      test
        .set(settings)
        .group(group)
        .requests(0)
        .end(done);
    });
  });

  describe('.page()', function(){
    it('should do nothing', function(done){
      var page = helpers.page();
      test
        .set(settings)
        .page(page)
        .requests(0)
        .end(done);
    });
  });

  describe('.screen()', function(){
    it('should do nothing', function(done){
      var screen = helpers.screen();
      test
        .set(settings)
        .screen(screen)
        .requests(0)
        .end(done);
    });
  });
});


// Outbound v1
// TODO REMOVE

describe('Outbound-V1', function () {
  var outbound;
  var settings;
  var test;

  beforeEach(function(){
    outbound = new Outbound;
    test = Test(outbound, __dirname);
    settings = { apiKey: 'f4f15f2f004fa0bd2140b4db93cbb538', v1: true };
  });

  it('should have correct settings', function(){
    test
      .name('Outbound')
      .endpoint('https://api.outbound.io')
      .retries(2);
  });

  it('should use the mapper', function(){
    assert.equal(outbound.mapper, mapper);
  });

  describe('.enabled()', function(){
    it('should be disabled everywhere', function(){
      test.disabled(new facade.Track({ channel : 'server' }));
      test.disabled(new facade.Track({ channel : 'client' }));
      test.disabled(new facade.Track({}));
    });
  });

  describe('.validate()', function(){
    it('should require an api key', function(){
      test.invalid({}, {});
      test.invalid({}, { apiKey : '' });
      test.valid({}, { apiKey : 'xxx' });
    });
  });

  describe('.track()', function(){
    it('should track successfully', function(done){
      var track = helpers.track();
      test
        .set(settings)
        .track(track)
        .sends({
          user_id: track.userId(),
          event: track.event(),
          payload: track.properties(),
          api_key: settings.apiKey
        })
        .expects(200)
        .end(done);
    });
  });

  describe('.identify()', function(){
    it('should identify successfully', function(done){
      var identify = helpers.identify();
      test
        .set(settings)
        .identify(identify)
        .sends({
          user_id: identify.userId(),
          traits: identify.traits(),
          api_key: settings.apiKey
        })
        .expects(200)
        .end(done);
    });
  });


  describe('.alias()', function(){
    it('should do nothing', function(done){
      var alias = helpers.alias();
      test
        .set(settings)
        .alias(alias)
        .requests(0)
        .end(done);
    });
  });

  describe('.group()', function(){
    it('should do nothing', function(done){
      var group = helpers.group();
      test
        .set(settings)
        .group(group)
        .requests(0)
        .end(done);
    });
  });

  describe('.page()', function(){
    it('should do nothing', function(done){
      var page = helpers.page();
      test
        .set(settings)
        .page(page)
        .requests(0)
        .end(done);
    });
  });

  describe('.screen()', function(){
    it('should do nothing', function(done){
      var screen = helpers.screen();
      test
        .set(settings)
        .screen(screen)
        .requests(0)
        .end(done);
    });
  });
});
