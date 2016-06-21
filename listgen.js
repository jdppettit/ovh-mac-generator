var config = require('./config');
var ip_functions = require('./lib/ip_functions');
var Promise = require('bluebird');
var ovh = require('ovh')({
 appKey: config.APP_KEY,
 appSecret: config.APP_SECRET,
 consumerKey: config.CONSUMER_KEY,
 endpoint: config.ENDPOINT
});

var ip_network = process.env.IP_RANGE;
var ip_array = ip_functions.enumerate(ip_network);
var ip_to_mac_list = [];

Promise.promisifyAll(ovh);

ovh.requestAsync('GET', '/dedicated/server/' + config.SERVICE_NAME + '/virtualMac').then(function(response) {
 process.stdout.write("Working...");
 Promise.each(response, function(vmac) {
  return ovh.requestAsync('GET', '/dedicated/server/' + config.SERVICE_NAME + '/virtualMac/' + vmac + '/virtualAddress').then(function(response) {
   process.stdout.write(".");
   if (ip_array.indexOf(response[0]) > -1) {
    ip_to_mac_list.push(ip_array[ip_array.indexOf(response[0])] + ' ' + vmac);
   }
  })
 }).then(function() {
  console.log();
  ip_to_mac_list.forEach(function(i) {
   console.log(i);
  });
 });
});
