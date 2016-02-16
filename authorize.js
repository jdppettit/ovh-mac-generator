var config = require('./config');
var ovh = require('ovh')({
	endpoint: config.ENDPOINT,
	appKey: config.APP_KEY,
	appSecret: config.APP_SECRET
});

ovh.request('POST', '/auth/credential', {
	'accessRules': [
		{ 'method': 'GET', 'path': '/*' },
		{ 'method': 'POST', 'path': '/*' }
	]
}, function(error, credential) {
	if (error) {
		console.log("Got an error...")
		console.error(error);
		process.exit(1);
	} else {
		console.log("Success!");
		console.log("Please do the following:");
		console.log("1. Take the consumerKey and add it to config.js");
		console.log("2. Visit the validationUrl and authorize this application");
		console.log("3. Run node IP_RANGE=$YOURNETWORKRANGE generator.js");
		console.log(credential);
		process.exit(0);
	}
});
