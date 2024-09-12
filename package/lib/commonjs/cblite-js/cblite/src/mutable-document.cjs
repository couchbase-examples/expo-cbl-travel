"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MutableDocument = void 0;
var _document = require("./document.cjs");
class MutableDocument extends _document.Document {
  constructor(id = null, sequenceNo = null, data = {}) {
    super(id, sequenceNo, data);
  }
  static fromDocument(document) {
    return new MutableDocument(document.getId(), document.getSequence(), document.getData());
  }
  remove(key) {
    delete this.doc[key];
    return this;
  }
  _set(key, value) {
    this.doc[key] = value;
  }
  setId(id) {
    // this._set('_id', id);
    this.id = id;
  }
  setArray(key, value) {
    this._set(key, value);
    return this;
  }
  setBlob(key, value) {
    if (value === null) {
      this._set(key, null);
      return this;
    }
    this._set(key, {
      _type: 'blob',
      data: value.toDictionary()
    });
    return this;
  }
  setBoolean(key, value) {
    this._set(key, value);
    return this;
  }
  setData(data) {
    this.doc = data;
    return this;
  }
  setDate(key, value) {
    if (value !== null) {
      this._set(key, value.toISOString());
    } else {
      this._set(key, value);
    }
    return this;
  }
  setDictionary(key, value) {
    this._set(key, value);
    return this;
  }
  setDouble(key, value) {
    this._set(key, value);
    return this;
  }
  setFloat(key, value) {
    this._set(key, value);
    return this;
  }
  setInt(key, value) {
    this._set(key, value);
    return this;
  }
  setLong(key, value) {
    this._set(key, value);
    return this;
  }
  setNumber(key, value) {
    this._set(key, value);
    return this;
  }
  setString(key, value) {
    this._set(key, value);
    return this;
  }
  setValue(key, value) {
    this._set(key, value);
    return this;
  }
}
exports.MutableDocument = MutableDocument;
//# sourceMappingURL=mutable-document.cjs.map