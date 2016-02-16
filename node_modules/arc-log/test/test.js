var arc = require('../arc');
var log = arc.log;
log.error = arc.error;

log("foo", "error");
log("bar", "FATAL");
log("baz", "WARN");

function foo() {
	console.log("foo");
}
arc.setErrorHandler(foo);

log.error("oh noes it errored!", new Error("Im ded"));
