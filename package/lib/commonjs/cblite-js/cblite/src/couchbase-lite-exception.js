"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CouchbaseLiteException = void 0;
class CouchbaseLiteException extends Error {
  constructor(
  // eslint-disable-next-line
  message,
  // eslint-disable-next-line
  domain,
  // eslint-disable-next-line
  code) {
    super();
    this.message = message;
    this.domain = domain;
    this.code = code;
  }
}
exports.CouchbaseLiteException = CouchbaseLiteException;
//# sourceMappingURL=couchbase-lite-exception.js.map