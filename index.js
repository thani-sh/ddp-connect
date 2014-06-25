var assert = require('assert');
var debug = require('debug')('debug');
var DDPClient = require('ddp');
var url = require('url');

module.exports = DDPConnect;

/**
 * Helps connecting to ddp servers with email and password
 * @param {String}   ddpUrl     ddp://user%40mail:pass@host[:port][?q=var, ...]
 * @param {Object}   ddpOptions Object with more ddp options
 * @param {Function} callback   callback(error, ddpClient)
 */
function DDPConnect (ddpUrl, ddpOptions, callback) {
  var ddpUrl = url.parse(ddpUrl);
  DDPConnect._validateUrl(ddpUrl);
  DDPConnect._overrideOptions(ddpOptions, ddpUrl);
  var ddpClient = new DDPClient(ddpOptions);
  var firstConnect = true;
  ddpClient.connect(function (err) {
    if(err) {
      callback(err);
    } else {
      var authParts = ddpUrl.auth.split(':');
      var params = [{
        user: {email: authParts[0]},
        password: authParts[1]
      }];
      ddpClient.call('login', params, function () {
        if(!firstConnect) {
          ddpClient.emit('reconnect');
        }
        callback(null, ddpClient);
        firstConnect = false;
      });
    };
  });
};

/**
 * Should throw an error if required params are missing
 * @param  {Object} ddpUrl Parsed url object
 */
DDPConnect._validateUrl = function(ddpUrl) {
  assert.equal(!!ddpUrl.auth, true);
  assert.equal(!!ddpUrl.hostname, true);
};

/**
 * Override ddpOptions (in place) with data from ddpUrl
 * @param  {Object} ddpOptions Current ddpOptions
 * @param  {Object} ddpUrl     Parsed ddp url
 */
DDPConnect._overrideOptions = function (ddpOptions, ddpUrl) {
  ddpOptions.host = ddpUrl.hostname;
  ddpOptions.port = ddpUrl.port || ddpOptions.port || '3000';
  ddpOptions.use_ssl = (ddpUrl.protocol === 'ddps');
  for(var name in ddpUrl.query) {
    ddpOptions[name] = ddpUrl.query[name];
  };
};
