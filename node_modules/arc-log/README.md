# arc-log
arc-log is a full featured logging solution for Node applications. arc-log handles log messages to the console and a log file on the filesystem.

## Install

`npm install --save arc-log`

## Use

First require arc-log:

```
var arc = require('arc-log');
var log = arc.log;
```

Next, drop `console` from `console.log` statements and add a log level:

```
console.log("foobar");

// Becomes...

log("foobar", "log_level");
```

Different log levels will print the message using different colors. See default option in the configuration section for colors.

You can require log directly if you are okay with default settings:

```
var log = require('arc-log').log;
```

Additionally, it is recommended that you use the error function for all error reporting. This will include the full error and the stack trace whereas the log function does not. You can use the error function like this:

```
var arclog = require('arc-log');

arclog.error("This is a message you want to show in front of the error", errorObject);
```

## Configuration

Several configuration options are exposed including:

* `max_log_level` - This is the numerical representation of the highest log level you want to show in logs. For example, if you only wanted errors to show in logs, set this to 1. If you want everything to show, set this to 5. Default value is 5.
* `log_to_file` - True/False - do you want stuff logged to a file also? Default value is false.
* `path` - The location of the file you want to log to on your filesystem. This is only needed if `log_to_file` is true. Setting does not exist by default.
* `log_to_console` - True/False - do you want messages to print to the console? Default value is true.
* `timestamp_format` - The format for timestamps. arc-log uses moment so reference the documentation [here](http://momentjs.com/docs/#/displaying/format/). Default value "M/D/YYY HH:mm:ss:SSS".

These can be accessed using the `set()` function:

```
arc.set(key, value);

// For example
arc.set(max_log_level, 1);
```

You can edit log levels and colors directly in `arc.js`. Log levels are mapped to numerical levels with `level_map`:

```
// Default options
var level_map = {
  "ERROR": 1,
  "FATAL": 2,
  "WARN": 3,
  "INFO": 4,
  "DEBUG": 5
};
```

You can also edit colors:

```
// Default options
var level_colors = {
  "ERROR": colors.red,
  "FATAL": colors.magenta,
  "WARN": colors.yellow,
  "INFO": colors.cyan,
  "DEBUG": colors.blue
};
```
