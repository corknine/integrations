
/**
 * Module dependencies.
 */

var isostring = require('isostring');
var hash = require('string-hash');
var time = require('unix-time');
var dot = require('obj-case');
var is = require('is');

/**
 * Map identify `msg`.
 *
 * @param {Identify} msg
 * @param {Object} settings
 * @return {Object}
 */

exports.identify = function(msg){
  var traits = formatTraits(msg.traits());
  var active = msg.active();
  var ret = {};

  ret.user_id = msg.userId();
  ret.custom_attributes = traits;

  if (msg.userAgent()) ret.last_seen_user_agent = msg.userAgent();
  if (msg.created()) ret.remote_created_at = time(msg.created());
  if (active) ret.last_request_at = time(msg.timestamp());
  if (msg.ip()) ret.last_seen_ip = msg.ip();
  if (msg.email()) ret.email = msg.email();
  if (msg.name()) ret.name = msg.name();

  // Add company data
  var companies = msg.proxy('traits.companies');
  var company = msg.proxy('traits.company');

  if (company) companies = [company];
  if (is.array(companies)) ret.companies = companies.map(formatCompany);

  return ret;
};

/**
 * Map track `msg`.
 *
 * @param {Track} msg
 * @param {Object} settings
 * @return {Object}
 */

exports.track = function(msg){
  var ret = {};
  ret.created = time(msg.timestamp());
  ret.event_name = msg.event();
  ret.user_id = msg.userId();
  if (msg.email()) ret.email = msg.email();
  ret.metadata = msg.properties();
  return ret;
};

/**
 * Formats a company for use with intercom
 *
 * http://docs.intercom.io/#Companies
 *
 * TODO: add .companies()
 *
 * @param {Object} company
 * @return {Object}
 * @api private
 */

function formatCompany(company){
  if (is.string(company)) company = { name : company };

  var ret = {};
  ret.name = company.name;
  ret.custom_attributes = company;

  if (company.id) {
    ret.company_id = company.id;
  } else if (company.name) {
    ret.company_id = hash(company.name);
  }

  var created = dot(company, 'created') || dot(company, 'createdAt');
  if (created) ret.remote_created_at = time(created);
  return ret;
}

/**
 * Format all the traits which are dates for intercoms format
 *
 * @param {Object} traits
 * @return {Object}
 * @api private
 */

function formatTraits(traits){
  var output = {};

  Object.keys(traits).forEach(function (key) {
    var val = traits[key];
    if (isostring(val) || is.date(val)) {
      val = time(val);
      key = dateKey(key);
    }

    output[key] = val;
  });

  return output;
};

/**
 * Set up a key with the dates for intercom
 *
 * http://docs.intercom.io/#CustomDataDates
 *
 * @param {String} key
 * @return {String}
 * @api private
 */

function dateKey(key){
  if (endswith(key, '_at')) return key;
  if (endswith(key, ' at')) return key.substr(0, key.length - 3) + '_at';
  return key + '_at';
}

/**
 * Test whether a string ends with the suffix
 *
 * @param {String} str
 * @param {String} suffix
 * @return {String}
 * @api private
 */

function endswith(str, suffix){
  str = str.toLowerCase();
  return str.substr(str.length - suffix.length) === suffix;
}
