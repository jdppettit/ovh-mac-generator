var netmask = require('netmask').Netmask;

/*
Author: Zack Buhman <zack@buhman.org>
*/

function dotted_to_number(address) {
    var octet_array = new Uint8Array(
        address.split('.').map(function(item) {
            return parseInt(item, 10);
        })
    );

    return new DataView(octet_array.buffer).getUint32(0, false);
}


function number_to_dotted(number) {
    var octet_array = new DataView(new ArrayBuffer(4));

    octet_array.setUint32(0, number, false);

    return new Uint8Array(octet_array.buffer).join('.');
}

function bit_mask(length) {
    return (1 << length) - 1;
}


function network_mask(length) {
    return bit_mask(length) << (32 - length);
}


function host_mask(length) {
    return bit_mask(32 - length);
}

function ip_range(address_in_range, network_length) {
    var number = dotted_to_number(address_in_range);
    var iter = number & network_mask(network_length);
    var last = number | host_mask(network_length);
    var array = [];
    while (iter <= last) {
        array.push(number_to_dotted(iter));
        iter++;
    }
    return array;
}

module.exports = {
  enumerate: function(ip_network_address) {
   var split_network_address = ip_network_address.split('/');
   var ip_in_range = split_network_address[0];
   var network_length = split_network_address[1];
   return ip_range(ip_in_range, network_length)
  }
};
