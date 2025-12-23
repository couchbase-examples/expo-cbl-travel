"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatabaseLogging = void 0;
// Couchbase Mobile Docs
//https://docs.couchbase.com/couchbase-lite/current/swift/troubleshooting-logs.html#lbl-file-logs

class DatabaseLogging {
  // eslint-disable-next-line
  constructor(database) {
    this.database = database;
  }
  setFileConfig(config) {
    return this.database.getEngine().database_SetFileLoggingConfig({
      name: this.database.getUniqueName(),
      config: config
    });
  }
}
exports.DatabaseLogging = DatabaseLogging;
//# sourceMappingURL=database-logging.js.map