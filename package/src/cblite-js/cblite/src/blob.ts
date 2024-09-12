export class Blob {
  public digest: string;
  public length: number;
  constructor(
    private contentType: string,
    private bytes: ArrayBuffer
  ) {}

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
      data: Array.from(new Uint8Array(this.bytes)),
    };
  }
}
