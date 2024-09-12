export class Blob {
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
//# sourceMappingURL=blob.mjs.map