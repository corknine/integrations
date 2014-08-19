
var convert = require('convert-dates');

/**
 * Map `track`.
 *
 * @param {Track} track
 * @return {Object}
 * @api private
 */

exports.track = function(track){
  return {
    user_id: track.userId(),
    event: track.event(),
    timestamp: track.timestamp(),
    properties: track.properties()
  };
};

/**
 * Map `identify`.
 *
 * @param {Identify} msg
 * @return {Object}
 * @api private
 */


exports.identify = function(identify){
  return {
    user_id: identify.userId(),
    traits: identify.traits()
  };
};
