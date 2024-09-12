export class CouchbaseLiteException extends Error {
  constructor(message, domain, code) {
    super();
    this.message = message;
    this.domain = domain;
    this.code = code;
  }
}
//# sourceMappingURL=couchbase-lite-exception.mjs.map