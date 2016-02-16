var moment = require('moment');
var colors = require('colors');
var path = require('path');
var Promise = require('bluebird').Promise;
var fs = Promise.promisifyAll(require('fs'));

var configuration = {
  max_log_level: 4,
  log_to_file: false,
  log_to_console: true,
  timestamp_format: "M/D/YYYY HH:mm:ss:SSS"
};

var level_colors = {
  "UNDEFINED": colors.white,
  "ERROR": colors.red,
  "FATAL": colors.magenta,
  "WARN": colors.yellow,
  "INFO": colors.cyan,
  "DEBUG": colors.blue,
  "SUCCESS": colors.green
};

var level_map = {
  "UNDEFINED": 0,
  "ERROR": 1,
  "FATAL": 2,
  "WARN": 3,
  "INFO": 4,
  "DEBUG": 5,
  "SUCCESS": 6
};

var errorHandler;

function logToFile(line) {
  if (configuration.hasOwnProperty("path")) {
    fs.appendFile(configuration.path, line + "\n", function(err) {
      if (err) {
        console.log(err);
      }
    });
  } else {
    console.log("No path for log file specified in configuration...");
  }
}

function getTimestamp() {
  return moment().format(configuration.timestamp_format);
}

function log(message, level) {
  if (typeof(level) !== "undefined" && typeof(level) === "string") {
    level = level.toUpperCase();
    if (level == "WARNING") {
      level = "WARN";
    }
  } else {
    level = "undefined";
  }

  var f = level_colors[level] || function(v) {
    return v;
  };
  var line = null;

  if (configuration.max_log_level >= level_map[level]) {
    line = f("[" + getTimestamp() + "] [" + level + "] " + message);
  }

  if (configuration.log_to_file && line !== null) {
    logToFile(line);
  }

  if (configuration.log_to_console && line !== null) {
    console.log(line);
  }
}

function set(key, value) {
  configuration[key] = value;
}

function error(message, errorObject) {
  if (typeof(errorObject) === "undefined") {
    // do nothing
  } else {
    var f = level_colors["ERROR"] || function(v) {
      return v;
    };

    if (configuration.max_log_level >= level_map["ERROR"]) {
      line = f("[" + getTimestamp() + "] [" + "ERROR" + "] " + message);
      console.error(line, errorObject, errorObject.stack);
      if (errorHandler) {
        errorHandler(errorObject);
      }
    }
  }
}

function setErrorHandler(handler) {
  errorHandler = handler;
}


var logObject = {};
logObject.log = log;
logObject.error = error;
logObject.set = set;
logObject.setErrorHandler = setErrorHandler;

module.exports = logObject;
