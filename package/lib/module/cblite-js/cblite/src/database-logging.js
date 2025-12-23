"use strict";

// Couchbase Mobile Docs
//https://docs.couchbase.com/couchbase-lite/current/swift/troubleshooting-logs.html#lbl-file-logs

export class DatabaseLogging {
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
//# sourceMappingURL=database-logging.js.map