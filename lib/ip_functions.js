var netmask = require('netmask').Netmask;

module.exports = {
  enumerate: function(ip_network_address) {
    var block = new netmask(ip_network_address);
    var split_ip = block.first.split('.');
    var first_ip = '' + split_ip[0] + '.' + split_ip[1] + '.' + split_ip[2] + '.';
    var last_octect_start = parseInt(block.first.split('.')[3]);
    var ip_array = [];
    for (var i = 0; i <= block.size; i++) {
      var new_last_octect = last_octect_start + i;
      var new_ip = first_ip + new_last_octect;
      ip_array.push(new_ip);
    }
    return ip_array;
  }
};
