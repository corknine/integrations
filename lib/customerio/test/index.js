
var Test = require('segmentio-integration-tester');
var helpers = require('../../../test/helpers');
var facade = require('segmentio-facade');
var convert = require('convert-dates');
var mapper = require('../mapper');
var del = require('obj-case').del;
var time = require('unix-time');
var assert = require('assert');
var should = require('should');
var CustomerIO = require('..');

describe('Customer.io', function(){
  var settings;
  var payload;
  var test;
  var cio;

  beforeEach(function(){
    cio = new CustomerIO;
    test = Test(cio, __dirname);
    test.mapper(mapper);
    payload = {};
    settings = {
      siteId: '83d520c82f8ddc4a67c8',
      apiKey: '1da93169bcc219b6f583'
    };
  });

  it('should have the correct settings', function(){
    test
      .name('Customer.io')
      .endpoint('https://app.customer.io/api/v1/customers/')
      .retries(2);
  });

  describe('.enabled()', function(){
    it('should be enabled for server side messages', function(){
      test.enabled({
        channel: 'server',
        userId: 'user-id'
      });
    });

    it('should be disabled for other messages', function(){
      test.disabled({
        channel: 'client',
        userId: 'user-id'
      });
    });

    it('should be disabled for messages without userId', function(){
      test.disabled({
        channel: 'server'
      });
    });
  });

  describe('.validate()', function(){
    it('should be invalid when apiKey is missing', function(){
      test.invalid({}, { siteId: 'xxx' });
    });

    it('should be invalid when siteId is missing', function(){
      test.invalid({}, { apiKey: 'api-key' });
    });

    it('should be valid when siteId and apiKey is given', function(){
      test.valid({}, settings);
    });
  });

  describe('mapper', function(){
    describe('identify', function(){
      it('should map basic message', function(){
        test.maps('identify-basic');
      });
    });

    describe('group', function(){
      it('should map basic message', function(){
        test.maps('group-basic');
      });
    });

    describe('track', function(){
      it('should map basic message', function(){
        test.maps('track-basic');
      });
    });
  });

  describe('.track()', function(){
    it('should get a good response from the API', function(done){
      var track = helpers.track();
      payload.timestamp = time(track.timestamp());
      payload.data = convert(track.properties(), time);
      payload.name = track.event();
      test
        .set(settings)
        .track(track)
        .sends(payload)
        .expects(200, done);
    });

    it('will error on an invalid set of keys', function(done){
      test
        .set({ apiKey: 'x', siteId: 'x' })
        .track(helpers.track())
        .expects(401)
        .error(done);
    });
  });

  describe('.identify()', function(){
    it('should get a good response from the API', function(done){
      var identify = helpers.identify();
      payload = identify.traits();
      payload.created_at = time(identify.created());
      payload.email = identify.email();
      del(payload, 'created');
      payload = convert(payload, time);

      test
        .set(settings)
        .identify(identify)
        .sends(payload)
        .expects(200, done);
    });

    it('will error on an invalid set of keys', function(done){
      test
        .set({ apiKey: 'x', siteId: 'x' })
        .identify(helpers.identify())
        .expects(401)
        .error(done);
    });

    it('should identify with only an email as id', function(done){
      test
        .set(settings)
        .identify({ userId: 'amir@segment.io' })
        .expects(200, done);
    });
  });


  describe('.group()', function(){
    it('should get a good response from the API', function(done){
      var group = helpers.group();
      payload = group.traits();
      del(payload, 'email');
      payload = prefixKeys('Group ', payload);
      payload['Group id'] = group.groupId();
      payload = convert(payload, time);
      payload.id = group.userId();
      payload.email = group.proxy('traits.email');
      test
        .set(settings)
        .group(group)
        .sends(payload)
        .expects(200, done);
    });
  });

  describe('.visit()', function(){
    it('should not send the request if active is false', function(done){
      var track = helpers.track();
      track.obj.options.active = false;
      cio.visit(track, settings, function(){
        arguments.length.should.eql(0);
        done();
      });
    });

    it('should send the request if active is true', function(done){
      var track = helpers.track(); // true by default.
      cio.visit(track, settings, done);
    });
  });

  describe('.alias()', function(){
    it('should do nothing', function(done){
      cio.alias({}, {}, function (err) {
        should.not.exist(err);
        done();
      });
    });
  });
});

/**
 * Prefix keys
 */

function prefixKeys(prefix, obj){
  return Object.keys(obj).reduce(function(ret, key){
    ret[prefix + key] = obj[key];
    return ret;
  }, {});
}
