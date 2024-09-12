"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CouchbaseLiteException = void 0;
class CouchbaseLiteException extends Error {
  constructor(message, domain, code) {
    super();
    this.message = message;
    this.domain = domain;
    this.code = code;
  }
}
exports.CouchbaseLiteException = CouchbaseLiteException;
//# sourceMappingURL=couchbase-lite-exception.cjs.map