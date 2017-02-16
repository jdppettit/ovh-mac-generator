var config = require('./config');
var ip_functions = require('./lib/ip_functions');
var Promise = require('bluebird');

function usage() {
  console.log('Usage: node listgen.js <ovh-ca/ovh-fr> <ns1234.ip-1-2-3.net> <1.2.3.4/5>');
  process.exit(1);
}

var endpoint = process.argv[2] || usage();

var ovh = require('ovh')({
 appKey: config.APP_KEY,
 appSecret: config.APP_SECRET,
 consumerKey: config.CONSUMER_KEY,
 endpoint: endpoint
});


var server = process.argv[3] || usage();
var ip_network = process.argv[4] || usage();

var ip_array = ip_functions.enumerate(ip_network);
var ip_to_mac_list = [];

Promise.promisifyAll(ovh);

ovh.requestAsync('GET', '/dedicated/server/' + server + '/virtualMac').then(function(response) {
 process.stderr.write("Working...");
 Promise.each(response, function(vmac) {
  return ovh.requestAsync('GET', '/dedicated/server/' + server + '/virtualMac/' + vmac + '/virtualAddress').then(function(response) {
   process.stderr.write(".");
   if (ip_array.indexOf(response[0]) > -1) {
    ip_to_mac_list.push(ip_array[ip_array.indexOf(response[0])] + ' ' + vmac);
   }
  })
 }).then(function() {
  console.error();
  ip_to_mac_list.forEach(function(i) {
   console.log(i);
  });
 });
});
