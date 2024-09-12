"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Document = void 0;
var _blob = require("./blob.cjs");
class Document {
  doc = {};
  constructor(id = null, sequenceNo = null, data = {}) {
    this.id = id;
    this.sequenceNo = sequenceNo;
    this.doc = data;
  }
  count() {
    return Object.keys(this.doc).length;
  }
  getData() {
    return this.doc;
  }
  _get(key) {
    return this.doc[key];
  }
  getArray(key) {
    return this._get(key);
  }
  getBlob(key) {
    const data = this._get(key);
    if (data.content_type) {
      const b = new _blob.Blob(data.content_type, null);
      b.digest = data.digest;
      b.length = data.length;
      return b;
    }
    return this._get(key);
  }
  async getBlobContent(key, collection) {
    const data = await collection.getEngine().collection_GetBlobContent({
      documentId: this.getId(),
      key: key,
      collectionName: collection.name,
      scopeName: collection.scope.name,
      name: collection.scope.database.getName()
    });
    return data.data;
  }
  getBoolean(key) {
    return this._get(key);
  }
  getDate(key) {
    return this._get(key);
  }
  getDictionary(key) {
    return this._get(key);
  }
  getDouble(key) {
    return this._get(key);
  }
  getFloat(key) {
    return this._get(key);
  }
  getId() {
    return this.id;
  }
  getInt(key) {
    return this._get(key);
  }
  getKeys() {
    return Object.keys(this.doc);
  }
  getLong(key) {
    return this._get(key);
  }
  getSequence() {
    return this.sequenceNo;
  }
  getString(key) {
    return this._get(key);
  }
  getValue(key) {
    return this._get(key);
  }
  toDictionary() {
    return this.doc;
  }
}
exports.Document = Document;
//# sourceMappingURL=document.cjs.map