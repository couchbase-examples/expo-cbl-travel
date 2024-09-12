import { Dictionary } from './definitions';
import { Blob } from './blob';
import { Collection } from './collection';

export class Document {
  protected doc: Dictionary = {};

  constructor(
    protected id: string = null,
    protected sequenceNo: number = null,
    data: Dictionary = {}
  ) {
    this.doc = data;
  }

  count(): number {
    return Object.keys(this.doc).length;
  }

  getData() {
    return this.doc;
  }

  private _get(key: string) {
    return this.doc[key];
  }

  getArray(key: string) {
    return this._get(key);
  }

  getBlob(key: string): Blob {
    const data = this._get(key);
    if (data.content_type) {
      const b = new Blob(data.content_type, null);
      b.digest = data.digest;
      b.length = data.length;
      return b;
    }
    return this._get(key);
  }

  async getBlobContent(
    key: string,
    collection: Collection
  ): Promise<ArrayBuffer> {
    const data = await collection.getEngine().collection_GetBlobContent({
      documentId: this.getId(),
      key: key,
      collectionName: collection.name,
      scopeName: collection.scope.name,
      name: collection.scope.database.getName(),
    });
    return data.data;
  }

  getBoolean(key: string) {
    return this._get(key);
  }

  getDate(key: string) {
    return this._get(key);
  }

  getDictionary(key: string) {
    return this._get(key);
  }

  getDouble(key: string) {
    return this._get(key);
  }

  getFloat(key: string) {
    return this._get(key);
  }

  getId(): string {
    return this.id;
  }

  getInt(key: string) {
    return this._get(key);
  }

  getKeys(): string[] {
    return Object.keys(this.doc);
  }

  getLong(key: string) {
    return this._get(key);
  }

  getSequence(): number {
    return this.sequenceNo;
  }

  getString(key: string) {
    return this._get(key);
  }

  getValue(key: string) {
    return this._get(key);
  }

  toDictionary() {
    return this.doc;
  }
}
