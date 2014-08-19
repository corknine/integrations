
/**
 * Module dependencies.
 */

var convert = require('convert-dates');
var object = require('obj-case');

/**
 * Map `track`.
 *
 * @param {Track} track
 * @return {Object}
 * @api private
 */

exports.track = function(track){
  return {
    userId: track.userId(),
    event: track.event(),
    timestamp: track.timestamp(),
    properties: track.properties()
  };
};
