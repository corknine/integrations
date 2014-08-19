
/**
 * Module dependencies.
 */

var integration = require('segmentio-integration');
var mapper = require('./mapper');

/**
 * Expose `KISSmetrics`
 */

var Attribution = module.exports = integration('Attribution')
  .endpoint('https://track.attributionapp.com')
  .mapper(mapper)
  .retries(2);

/**
 * Validate.
 *
 * @param {Facade} message
 * @param {Object} settings
 * @api public
 */

Attribution.prototype.validate = function(_, settings){
  return this.ensure(settings.projectId, 'projectId');
};

/**
 * Track.
 *
 * @param {Track} track
 * @param {Object} settings
 * @param {Function} fn
 * @api private
 */

Attribution.prototype.track = function(payload, settings, fn){
  return this
    .post('/track')
    .auth(settings.projectId)
    .type('.json')
    .send(payload)
    .end(this.handle(fn));
};

Attribution.prototype.identify = function(payload, settings, fn){
  return this
    .post('/identify')
    .auth(settings.projectId)
    .type('.json')
    .send(payload)
    .end(this.handle(fn));
};
