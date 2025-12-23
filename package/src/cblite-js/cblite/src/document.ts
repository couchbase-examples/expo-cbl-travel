import { Dictionary } from './definitions';
import { Blob } from './blob';
import { Collection } from './collection';
import { ICoreEngine } from '../core-types';
import { EngineLocator } from './engine-locator';

export class Document {
  protected doc: Dictionary = {};
  private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);

  constructor(
    protected id: string = null,
    // eslint-disable-next-line
    protected sequenceNo: number = null,
    // eslint-disable-next-line
    protected revisionID: string = null,
    // eslint-disable-next-line
    protected collection: Collection = null,
    data: Dictionary = {}
  ) {
    if (id === null) {
      this.id = this._engine.getUUID();
    }
    this.doc = data;
  }

  /**
   * The number of properties in the document.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  count(): number {
    return Object.keys(this.doc).length;
  }

  /**
   * Returns the document data as a dictionary.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getData(): Dictionary {
    return this.doc;
  }

  private _get(key: string) {
    return this.doc[key];
  }

  /**
   * Get a property’s value as a ArrayObject, which is a mapping object of an array value.
   * Returns null if the property doesn’t exists, or its value is not an array.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getArray(key: string): [] | null {
    if (key in this.doc && Array.isArray(this.doc[key])) {
      return this.doc[key] as [];
    }
    return null;
  }

  /**
   * Returns the Blob associated with the given key, including its content.
   * Returns null if the property doesn’t exist, or its value is not a blob.
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
 async getBlob(key: string): Promise<Blob | null> {
    if (key in this.doc) {
      const data = this._get(key);
      if (data && typeof data === 'object' && 'content_type' in data) {
        const blobContent = await this.getBlobContent(key);
        const b = new Blob(data.content_type, blobContent);
        b.digest = data.digest;
        b.length = data.length;
        return b;
      }
    }
    return null;
  }

  /**
   * Get a property’s value as a ArrayBuffer. Returns null if the property doesn’t exist,
   * or its value is not a blob.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  async getBlobContent(key: string): Promise<ArrayBuffer> {
    const data = await this._engine.collection_GetBlobContent({
      documentId: this.getId(),
      key: key,
      collectionName: this.collection.name,
      scopeName: this.collection.scope.name,
      name: this.collection.scope.database.getUniqueName(),
    });
    return data.data;
  }

  /**
   * Gets a property’s value as a boolean value. Returns true if the value exists,
   * and is either true or a nonzero number.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getBoolean(key: string): boolean | null {
    if (key in this.doc) {
      const value = this.doc[key];
      if (typeof value === 'boolean') {
        return value;
      }
      if (value === 0 || value === '0.0') {
        return false;
      }
      if (value === null) {
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * The collection that the document belongs to.
   *
   * Throws an error if the database is closed.
   *
   * @function
   */
  getCollection(): Collection | null {
    return this.collection;
  }

  /**
   * Gets a property’s value as a Date value. JSON does not directly support dates, so
   * the actual property value must be a string, which is then parsed according to the
   *  ISO-8601 date format (the default used in JSON.) Returns null if the value doesn’t
   *  exist, is not a string, or is not parseable as a date. NOTE: This is not a generic
   *  date parser! It only recognizes the ISO-8601 format, with milliseconds.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getDate(key: string): Date | null {
    if (key in this.doc) {
      const value = this.doc[key];
      if (typeof value === 'string') {
        const date = new Date(value);
        // Check if the date is valid (not "Invalid Date")
        return !isNaN(date.getTime()) ? date : null;
      }
    }
    return null;
  }

  /**
   * Get a property’s value as a Dictionary, which is a mapping object of a dictionary
   * value. Returns null if the property doesn’t exists, or its value is not a dictionary.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getDictionary(key: string): Dictionary | null {
    if (key in this.doc) {
      const value = this.doc[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as Dictionary;
      }
    }
    return null;
  }

  /**
   * Gets a property’s value as a double value. Integers will be converted to double.
   * The value true is returned as 1.0, false as 0.0. Returns 0.0 if the property doesn’t
   * exist or does not have a numeric value.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getDouble(key: string): number | null {
    if (key in this.doc) {
      const value = this.doc[key];
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'boolean') {
        return value ? 1.0 : 0.0;
      }
    }
    return 0.0;
  }

  /**
   * Gets a property’s value as a float value. Integers will be converted to float.
   * The value true is returned as 1.0, false as 0.0. Returns 0.0 if the property doesn’t
   * exist or does not have a numeric value.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getFloat(key: string): number | null {
    if (key in this.doc) {
      const value = this.doc[key];
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'boolean') {
        return value ? 1.0 : 0.0;
      }
    }
    return 0.0;
  }

  /**
   * Returns the document’s ID.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getId(): string {
    return this.id;
  }

  /**
   * Gets a property’s value as an int value. Floating point values will be rounded.
   * The value true is returned as 1, false as 0. Returns 0 if the property doesn’t
   * exist or does not have a numeric value.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getInt(key: string): number | null {
      if (key in this.doc) {
        const value = this.doc[key];
        if (typeof value === 'number') {
          return Math.floor(value);
        }
        if (typeof value === 'boolean') {
          return value ? 1 : 0;
        }
      }
      return 0;
  }

  /**
   * returns an array containing all keys, or an empty array if the document
   * has no properties.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getKeys(): string[] {
    return Object.keys(this.doc);
  }

  /**
   * Gets a property’s value as an number value. Floating point values will be rounded.
   * The value true is returned as 1, false as 0. Returns 0 if the property doesn’t
   * exist or does not have a numeric value.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getLong(key: string): number | null {
    return key in this.doc ? this.doc[key] : 0;
  }

  /**
   * The ID representing a document’s revision.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getRevisionID(): string {
    return this.revisionID;
  }

  /**
   * Sequence number of the document in the database. This indicates how recently the
   * document has been changed: every time any document is updated, the database assigns it
   * the next sequential sequence number. Thus, if a document’s sequence property changes
   * that means it’s been changed (on-disk); and if one document’s sequence is greater than
   * another’s, that means it was changed more recently.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getSequence(): number {
    return this.sequenceNo;
  }

  /**
   * Gets a property’s value as a string. Returns nil if the property doesn’t exist, i
   * or its value is not a string.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  getString(key: string): string | null {
    if (key in this.doc) {
      const value = this.doc[key];
      if (typeof value === 'string') {
        return value;
      }
    }
    return null;
  }

  /**
   * @deprecated getValue is deprecated.  Returns values as any.
   */
  getValue(key: string) {
    return key in this.doc ? this.doc[key] : null;
  }

  /**
   * Returns the document data as a dictionary.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  toDictionary(): Dictionary {
    return this.doc;
  }

  /**
 * Converts the document content to a JSON string representation
 * @returns {string} A JSON string 
 * 
 * @function
 */
  toJsonString(): string {
    return JSON.stringify(this.doc);
  }
}
