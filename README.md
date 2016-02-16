# ovh-mac-generator

This project contains three scripts that enable you to easily and programmatically
generate vMAC (virtualMac) addresses for all IP addresses in a certain range with
OVH.

## Requirements

* Node.js >= 4.0.0

## Use

* Create an OVH application [In the US](https://ca.api.ovh.com/createApp/) [In Europe](https://eu.api.ovh.com/createApp/) - other options available [here](http://ovh.github.io/node-ovh/)
* `cp config.js.example config.js`
* Put the `APP_KEY` and `APP_SECRET` in the appropriate spots in config.js. Also, populate the endpoint and service name. Possible endpoints can be found [here](http://ovh.github.io/node-ovh/) - the service name is the name of your server available in the OVH control panel.
* `node authorize.js`. You will see something like this:

```
Success!
Please do the following:
1. Take the consumerKey and add it to config.js
2. Visit the validationUrl and authorize this application
3. Run node IP_RANGE=$YOURNETWORKRANGE generator.js
{ validationUrl: 'https://ca.api.ovh.com/auth/?credentialToken=sloth',
  consumerKey: 'turtle',
  state: 'pendingValidation' }
```

Follow the instructions above.

* `IP_RANGE=1.1.1.1/24 node generator.js` - substitute your IP range using CIDR notation. This will take a while to run, once it stops proceed on to the last step.
* `IP_RANGE=1.1.1.1/24 node listgen.js` - This will take a minute or so depending on how many IPs you have total, once it is done you will get a list of IP addresses and vMACs.
* You should be done. If you are [Virtkick](https://virtkick.com) user you can copy and paste the list right into the OVH mapping box to set up your new range in the Virtkick panel.
