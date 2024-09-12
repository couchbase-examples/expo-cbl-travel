"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollationUnicode = exports.CollationASCII = exports.Collation = void 0;
class Collation {
  _unicode = false;
  _ignoreCase = false;
  _ignoreAccents = false;
  _locale = null;
  static ascii() {
    return new CollationASCII();
  }
  static unicode() {
    return new CollationUnicode();
  }
  toString() {
    return 'Collation{' + 'unicode=' + this._unicode + ', ignoreCase=' + this._ignoreCase + ', ignoreAccents=' + this._ignoreAccents + ", locale='" + this._locale + "'" + '}';
  }
  asJSON() {
    const json = {};
    json.UNICODE = this._unicode;
    json.LOCALE = this._locale == null ? null : this._locale;
    json.CASE = !this._ignoreCase;
    json.DIAC = !this._ignoreAccents;
    return json;
  }
}
exports.Collation = Collation;
class CollationASCII extends Collation {
  constructor() {
    super();
    this._unicode = false;
  }
  ignoreCase(ignoreCase) {
    this._ignoreCase = ignoreCase;
    return this;
  }
}
exports.CollationASCII = CollationASCII;
class CollationUnicode extends Collation {
  constructor() {
    super();
    this._unicode = true;
  }
  ignoreCase(ignoreCase) {
    this._ignoreCase = ignoreCase;
    return this;
  }
  ignoreAccents(ignoreAccents) {
    this._ignoreAccents = ignoreAccents;
    return this;
  }
  locale(locale) {
    this._locale = locale;
    return this;
  }
}
exports.CollationUnicode = CollationUnicode;
//# sourceMappingURL=collation.cjs.map