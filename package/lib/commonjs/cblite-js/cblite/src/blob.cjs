"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Blob = void 0;
class Blob {
  constructor(contentType, bytes) {
    this.contentType = contentType;
    this.bytes = bytes;
  }
  getContentType() {
    return this.contentType;
  }
  getDigest() {
    return this.digest;
  }
  getLength() {
    return this.length;
  }
  toDictionary() {
    return {
      contentType: this.contentType,
      data: Array.from(new Uint8Array(this.bytes))
    };
  }
}
exports.Blob = Blob;
//# sourceMappingURL=blob.cjs.map