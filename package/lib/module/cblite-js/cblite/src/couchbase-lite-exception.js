"use strict";

export class CouchbaseLiteException extends Error {
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
//# sourceMappingURL=couchbase-lite-exception.js.map