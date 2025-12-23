"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogLevel = exports.LogDomain = void 0;
/**
 * Log level enumeration
 * 
 * Represents the severity level of log messages.
 * Lower numbers = more verbose, higher numbers = less verbose
 */
let LogLevel = exports.LogLevel = /*#__PURE__*/function (LogLevel) {
  LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
  LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
  LogLevel[LogLevel["INFO"] = 2] = "INFO";
  LogLevel[LogLevel["WARNING"] = 3] = "WARNING";
  LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
  LogLevel[LogLevel["NONE"] = 5] = "NONE";
  return LogLevel;
}({});
/**
 * Log domain enumeration
 * 
 * Represents different functional areas of Couchbase Lite that can be logged.
 */
let LogDomain = exports.LogDomain = /*#__PURE__*/function (LogDomain) {
  LogDomain["DATABASE"] = "DATABASE";
  LogDomain["QUERY"] = "QUERY";
  LogDomain["REPLICATOR"] = "REPLICATOR";
  LogDomain["NETWORK"] = "NETWORK";
  LogDomain["LISTENER"] = "LISTENER";
  LogDomain["ALL"] = "ALL";
  return LogDomain;
}({});
//# sourceMappingURL=log-sinks-enums.js.map