var config = require('./config');
var ip_functions = require('./lib/ip_functions');
var uuid = require('uuid');
var Promise = require('bluebird');
var arclog = require('arc-log');
var ovh = require('ovh')({
 appKey: config.APP_KEY,
 appSecret: config.APP_SECRET,
 consumerKey: config.CONSUMER_KEY,
 endpoint: config.ENDPOINT
});

var ip_network = process.env.IP_RANGE;
var ip_array = ip_functions.enumerate(ip_network);

Promise.promisifyAll(ovh);

function requestVirtualMac(ip_address) {
 return ovh.requestAsync('POST', '/dedicated/server/' + config.SERVICE_NAME + '/virtualMac', {
  ipAddress: ip_address,
  type: 'ovh',
  virtualMachineName: uuid.v4()
 }).then(function(result) {
  arclog.log("OVH is now working on a MAC for " + ip_address + "...", "info");
  return checkRequestStatus(result, ip_address);
 }).catch(function(err) {
  arclog.error("Got problem requesting virtualMac for IP " + ip_address, err);
 });
}

function checkRequestStatus(request, ip_address) {
 return ovh.requestAsync('GET', '/dedicated/server/' + config.SERVICE_NAME + '/task/' + request.taskId).then(function(response) {
  if (response.doneDate) {
   arclog.log("IP Address " + ip_address + " MAC has been successfully generated...", "info");
   return Promise.resolve();
  }
  return Promise.delay(5000).then(function() {
   return checkRequestStatus(request, ip_address);
  });
 });
}

Promise.each(ip_array, function(ip) {
 arclog.log("Sending request for IP " + ip, "info");
 return requestVirtualMac(ip);
});
