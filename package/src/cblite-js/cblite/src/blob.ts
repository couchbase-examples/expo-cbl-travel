
interface BlobJSON {
  contentType: string;
  bytes: number[];  // ArrayBuffer is serialized as number array
}

export class Blob {
  public digest: string;
  public length: number;
  public bytes: ArrayBuffer;

    /**
   * Creates a new Blob instance to store binary data with a specified content type
   * @param contentType - The MIME type of the blob content (e.g., 'image/jpeg', 'text/plain')
   * @param data - The binary data as either a Uint8Array or ArrayBuffer
   * @example
   * // Create from Uint8Array
   * const uint8Array = new Uint8Array([1, 2, 3]);
   * const blob1 = new Blob('text/plain', uint8Array);
   * 
   * // Create from ArrayBuffer
   * const arrayBuffer = new ArrayBuffer(3);
   * const blob2 = new Blob('text/plain', arrayBuffer);
   */
  constructor(
    private contentType: string,
    data: Uint8Array | ArrayBuffer
  ) {
    this.contentType = contentType;
    this.bytes = data instanceof Uint8Array ? data.buffer : data;
  }

   /**
   * Creates a new Blob instance from a JSON string representation
   * @param jsonString - A JSON string containing blob data with format: { contentType: string, bytes: number[] }
   * @returns A new Blob instance
   * @throws {Error} If the JSON is invalid, missing required properties, or has incorrect types
   * @example
   * const jsonStr = '{"contentType": "image/jpeg", "bytes": [255, 216, 255, 224]}';
   * const blob = Blob.fromJSON(jsonStr);
   */
  static fromJSON(jsonString: string): Blob {
    try {
      const data = JSON.parse(jsonString) as BlobJSON;
      
      // Validate required properties and types
      if (!data.contentType || typeof data.contentType !== 'string') {
        throw new Error('Invalid or missing contentType property');
      }
      
      if (!Array.isArray(data.bytes)) {
        throw new Error('Invalid or missing bytes property');
      }

      // Convert number array back to ArrayBuffer
      const bytes = new Uint8Array(data.bytes);
      
      return new Blob(data.contentType, bytes);
    } catch (e) {
      throw new Error(`Failed to parse Blob JSON: ${e.message}`);
    }
  }

  /**
   * Returns the raw binary data of the blob
   * @returns {Uint8Array} The blob's content as an Uint8Array
   */
  getBytes():Uint8Array {
    return new Uint8Array(this.bytes);
  }

    /**
   * Returns the MIME type of the blob's content
   * @returns {string} The content type (MIME type) of the blob
   */
  getContentType():string {
    return this.contentType;
  }

   /**
   * Returns the cryptographic digest (hash) of the blob's content
   * @returns {string} The blob's content digest
   */
  getDigest():string {
    return this.digest;
  }

   /**
   * Returns the size of the blob's content in bytes
   * @returns {number} The length of the blob in bytes
   */
  getLength(): number {
    return this.length;
  }

    /**
   * Converts the blob into a plain JavaScript object representation
   * @returns {{ contentType: string, data: number[] }} An object containing the blob's content type and data as a byte array
   */
  toDictionary(): { contentType: string, data: number[] } {
    return {
      contentType: this.contentType,
      data: Array.from(new Uint8Array(this.bytes)),
    };
  }
}
