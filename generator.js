var config = require('./config');
var ip_functions = require('./lib/ip_functions');
var uuid = require('uuid');
var Promise = require('bluebird');
var ovh = require('ovh')({
  appKey: config.APP_KEY,
  appSecret: config.APP_SECRET,
  consumerKey: config.CONSUMER_KEY,
  endpoint: config.ENDPOINT
});

var ip_network = process.env.IP_RANGE;
var ip_array = ip_functions.enummerate(ip_network);

function requestVirtualMac(ip_address) {
  ovh.request('POST', '/dedicated/server/' + config.SERVICE_NAME, {
    ipAddress: ip_address,
    type: 'ovh',
    virtualMachineName: uuid.v4()
  }, function(error, result) {
    if (error) {
      throw error;
    } else {
      return checkRequestStatus(result);
    }
  });
}

function checkRequestStatus(request) {
  return new Promise(function(resolve) {
    ovh.request('GET', '/dedicated/server' + config.SERVICE_NAME + '/task/' + request.properties.taskId.description, function(error, response) {
      if (error) {
        throw error;
      } else {
        console.log(response);
        return Promise.delay(5000).then(function() {
          checkRequestStatus(request);
        });
      }
    });
  });
}

Promise.map(ip_array, function(ip) {
  return requestVirtualMac(ip);
}).then(function() {
  console.log("Done");
});
