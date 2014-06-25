var assert = require('assert');
var DDPConnect = require('../index');

describe('DDPConnect', function() {
  it('should throw an error if required params are not valid', function() {
    // No arguments
    assert.throws(function () {
      DDPConnect();
    }, Error);

    // Incorrect type for url
    assert.throws(function () {
      DDPConnect(100, {});
    }, Error);

    // Incorrect type for options
    assert.throws(function () {
      DDPConnect('ddp://user%40gmail.com:pass@localhost:1234', 100);
    }, Error);
  });

  it('should throw an error if ddp url is not valid', function() {
    // Invalid url
    assert.throws(function () {
      DDPConnect('this is not a url', {});
    }, Error);

    // Missing username%40mail:password
    assert.throws(function () {
      DDPConnect('ddp://localhost:3000', {});
    }, Error);
  });

  it('should timeout if unable to connect', function(done) {
    var ddpUrl = 'ddp://user%40gmail.com:pass@localhost:1234';
    DDPConnect(ddpUrl, {}, function (err, ddpClient) {
      assert.equal(!!err, true);
      done();
    });
    setTimeout(function() {
      done();
    }, 500);
  });
});