import { Collection } from './collection';
import { Document } from './document';
import { Dictionary } from './definitions';
import { Blob } from './blob';

interface BlobDefinition {
  _type: 'blob';
  data: Dictionary;
}

export class MutableDocument extends Document {
  private _blobs: { [key: string]: BlobDefinition | null };

  constructor();
  // eslint-disable-next-line
  constructor(id: string);
  // eslint-disable-next-line
  constructor(id: string, data: Dictionary);
  // eslint-disable-next-line
  constructor(id: string | null, sequenceNo: number | null, data: Dictionary | null);
  // eslint-disable-next-line
  constructor( id?: string, sequenceNo?: number, revisionID?: string, data?: Dictionary, collection?: Collection);
  // Actual constructor implementation
  constructor(
    id: string = null,
    sequenceNoOrData: number | Dictionary = null,
    revisionIDOrData: string | Dictionary = null,
    data: Dictionary = {},
    collection: Collection = null,
  ) {
    if (arguments.length === 0) {
      super(null, null, null, null, {});
    } else if (arguments.length === 1) {
      // Just ID
      if (id === null || id.length === 0) {
        super(null, null, null, null, {});
      } else {
      super(id, null, null, null, {});
      }
    } else if (arguments.length === 2 && typeof sequenceNoOrData === 'object') {
      // ID and data
      super(id, null, null, null, sequenceNoOrData || {});
    } else if (arguments.length === 3 && typeof revisionIDOrData === 'object') {
      // ID, sequenceNo, and data
      super(id, sequenceNoOrData as number, null, null, revisionIDOrData || {});
    } else {
      // Full constructor
      super(id, sequenceNoOrData as number, revisionIDOrData as string, collection, data);
    }
    this._blobs = {};
  }

    /**
   * Creates a new MutableDocument instance from an existing Document
   * @param {Document} document - The source Document to create a mutable copy from
   * @returns {MutableDocument} A new MutableDocument containing the same data as the source document
   * @example
   * const doc = await collection.document('doc1');
   * const mutableDoc = MutableDocument.fromDocument(doc);
   * 
   * // Now you can modify the document
   * mutableDoc.setString('name', 'John');
   * await collection.save(mutableDoc);
   */
  static fromDocument(document: Document) {
    return new MutableDocument(
      document.getId(),
      document.getSequence(),
      document.getRevisionID(),
      document.getData(),
      document.getCollection()
    );
  }

  static fromJSON(documentId: string, jsonString: string): MutableDocument {
    try {
      const data = JSON.parse(jsonString);
      return new MutableDocument(documentId, data);
    } catch (e) {
      throw new Error(`Failed to parse JSON string: ${e.message}`);
    }
  }

  /**
   * Removes a property from the document
   * @param {string} key - The property key to remove. Can be a dot-notation path for nested properties
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Remove a top-level property
   * doc.remove('name');
   * 
   * // Remove a nested property
   * doc.remove('address.city');
   * 
   * // Chain with other methods
   * doc.remove('name')
   *    .setString('title', 'Mr.')
   *    .setNumber('age', 30);
   */
  remove(key: string): MutableDocument {
    const parts = key.split('.');
    let current = this.doc;
    
    // Navigate to the parent object for nested properties
    for (let i = 0; i < parts.length - 1; i++) {
      if (current[parts[i]] === undefined) {
        return this;
      }
      current = current[parts[i]];
    }
    
    // Delete the final property
    delete current[parts[parts.length - 1]];
    return this;
  }

   /**
   * Internal method to set a value in the document
   * @param {string} key - The property key where the value will be stored
   * @param {T | null} value - The value to store, can be null
   * @template T - The type of the value being stored
   * @private
   * @example
   * // This is an internal method, typically used by public setters:
   * // Instead of using _set directly, use public methods like:
   * doc.setString('name', 'John');
   * doc.setNumber('age', 30);
   */
  _set<T>(key: string, value: T | null) {
    if (key in this._blobs) {
      delete this._blobs[key];
    }
    this.doc[key] = value;
  }

    /**
   * Sets the document's ID
   * @param {string} id - The new ID for the document
   * @example
   * const doc = new MutableDocument();
   * doc.setId('user123');
   * 
   * // Note: Changing an existing document's ID is generally not recommended
   * // as it may affect document tracking and replication
   */
  setId(id: string) {
    this.id = id;
  }

   /**
   * Sets an array value for a given key in the document
   * @param {string} key - The property key where the array will be stored
   * @param {T[]} value - The array to store
   * @template T - The type of elements in the array
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set an array of strings
   * doc.setArray('tags', ['important', 'urgent']);
   * 
   * // Set an array of numbers
   * doc.setArray('scores', [85, 92, 78]);
   * 
   * // Chain with other methods
   * doc.setArray('items', ['a', 'b'])
   *    .setString('status', 'active');
   */
  setArray<T>(key: string, value: T[]): MutableDocument {
    this._set(key, value);
    return this;
  }

  /**
   * Sets a blob value for a given key in the document
   * @param {string} key - The property key where the blob will be stored
   * @param {Blob | null} value - The blob to store, or null to remove existing blob
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Create and set a new blob
   * const bytes = new Uint8Array([72, 101, 108, 108, 111]);
   * const blob = new Blob('text/plain', bytes);
   * doc.setBlob('attachment', blob);
   * 
   * // Remove a blob
   * doc.setBlob('attachment', null);
   * 
   * // Chain with other methods
   * doc.setBlob('attachment', blob)
   *    .setString('filename', 'hello.txt');
   */
  setBlob(key: string, value: Blob | null): MutableDocument {
    //remove it from the internal doc because it's a blob
    if (key in this.doc) {
      delete this.doc[key];
    }
    if (value === null) {
      this._blobs[key] = null;
      return this;
    }
    this._blobs[key] =  {
      _type: 'blob',
      data: value.toDictionary(),
    };
    return this;
  }

  /**
   * Sets a boolean value for a given key in the document
   * @param {string} key - The property key where the boolean will be stored
   * @param {boolean} value - The boolean value to store
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set a boolean value
   * doc.setBoolean('isActive', true);
   * 
   * // Set multiple boolean values using method chaining
   * doc.setBoolean('isEnabled', true)
   *    .setBoolean('isVisible', false)
   *    .setBoolean('isLocked', true);
   */
  setBoolean(key: string, value: boolean): MutableDocument {
    this._set(key, value);
    return this;
  }

  /**
   * Sets the collection that this document belongs to
   * @param {Collection} collection - The collection instance to associate with this document
   * @example
   * const collection = await database.collection('users');
   * const doc = new MutableDocument('user123');
   * doc.setCollection(collection);
   * 
   * // Note: This method is typically used internally. 
   * // Documents are usually associated with collections when created through the collection itself
   */
  setCollection(collection: Collection) {
    this.collection = collection;
  }

    /**
   * Sets the entire document's data content
   * @param {Dictionary} data - An object containing all the data to be stored in the document
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set complete document data
   * doc.setData({
   *   name: 'John Doe',
   *   age: 30,
   *   email: 'john@example.com'
   * });
   * 
   * // Chain with other methods
   * doc.setData({ name: 'John' })
   *    .setString('title', 'Mr.');
   * 
   * // Replace existing data
   * const newData = { status: 'active', type: 'user' };
   * doc.setData(newData); // Previous data is completely replaced
   */
  setData(data: Dictionary): MutableDocument {
    this.doc = data;
    return this;
  }

  /**
   * Sets a date value for a given key in the document
   * @param {string} key - The property key where the date will be stored
   * @param {Date | null} value - The date to store, or null to remove the date
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set current date
   * doc.setDate('createdAt', new Date());
   * 
   * // Set specific date
   * doc.setDate('dueDate', new Date('2024-12-31'));
   * 
   * // Remove date
   * doc.setDate('expiredAt', null);
   * 
   * // Chain with other methods
   * doc.setDate('createdAt', new Date())
   *    .setString('status', 'active');
   * 
   * // Note: Dates are stored as ISO 8601 strings in the document
   */
  setDate(key: string, value: Date | null): MutableDocument {
    if (value !== null) {
      this._set(key, value.toISOString());
    } else {
      this._set(key, value);
    }
    return this;
  }

    /**
   * Sets a dictionary (object) value for a given key in the document
   * @param {string} key - The property key where the dictionary will be stored
   * @param {Dictionary | null} value - The dictionary to store, or null to remove the dictionary
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set a dictionary
   * doc.setDictionary('address', {
   *   street: '123 Main St',
   *   city: 'Boston',
   *   state: 'MA',
   *   zip: '02108'
   * });
   * 
   * // Remove a dictionary
   * doc.setDictionary('oldAddress', null);
   * 
   * // Chain with other methods
   * doc.setDictionary('contact', { email: 'john@example.com' })
   *    .setString('status', 'active');
   */
  setDictionary(key: string, value: Dictionary | null): MutableDocument {
    this._set(key, value);
    return this;
  }

    /**
   * Sets a double-precision floating point number for a given key in the document
   * @param {string} key - The property key where the number will be stored
   * @param {number} value - The double value to store
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set a double value
   * doc.setDouble('price', 99.99);
   * 
   * // Set a scientific notation
   * doc.setDouble('distance', 1.23e-4);
   * 
   * // Chain with other methods
   * doc.setDouble('weight', 75.5)
   *    .setDouble('height', 182.3)
   *    .setString('unit', 'metric');
   */
  setDouble(key: string, value: number): MutableDocument {
    this._set(key, value);
    return this;
  }

  /**
   * Sets a single-precision floating point number for a given key in the document
   * @param {string} key - The property key where the number will be stored
   * @param {number} value - The float value to store
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set a float value
   * doc.setFloat('temperature', 98.6);
   * 
   * // Set a scientific notation
   * doc.setFloat('measurement', 3.14e2);
   * 
   * // Chain with other methods
   * doc.setFloat('latitude', 42.3601)
   *    .setFloat('longitude', -71.0589)
   *    .setString('location', 'Boston');
   * 
   * // Note: Use setDouble() instead if you need higher precision
   */
  setFloat(key: string, value: number): MutableDocument {
    this._set(key, value);
    return this;
  }

    /**
   * Sets a 32-bit integer value for a given key in the document
   * @param {string} key - The property key where the integer will be stored
   * @param {number} value - The integer value to store
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set an integer value
   * doc.setInt('age', 25);
   * 
   * // Set a negative integer
   * doc.setInt('temperature', -5);
   * 
   * // Chain with other methods
   * doc.setInt('quantity', 100)
   *    .setInt('minStock', 10)
   *    .setString('status', 'in-stock');
   * 
   * // Note: For larger numbers, use setLong() instead
   */
  setInt(key: string, value: number): MutableDocument {
    this._set(key, value);
    return this;
  }

    /**
   * Sets a 64-bit integer value for a given key in the document
   * @param {string} key - The property key where the long integer will be stored
   * @param {number} value - The long integer value to store
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set a large integer value
   * doc.setLong('fileSize', 2147483648);
   * 
   * // Set a timestamp
   * doc.setLong('timestamp', Date.now());
   * 
   * // Chain with other methods
   * doc.setLong('userId', 9876543210)
   *    .setString('status', 'active');
   * 
   * // Note: Use this instead of setInt() for numbers larger than 2^31 - 1
   */
  setLong(key: string, value: number): MutableDocument {
    this._set(key, value);
    return this;
  }

   /**
   * Sets a numeric value for a given key in the document
   * @param {string} key - The property key where the number will be stored
   * @param {number} value - The numeric value to store
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set various types of numbers
   * doc.setNumber('integer', 42);
   * doc.setNumber('decimal', 3.14);
   * doc.setNumber('scientific', 1.23e-4);
   * doc.setNumber('negative', -10);
   * 
   * // Chain with other methods
   * doc.setNumber('price', 99.99)
   *    .setString('currency', 'USD');
   * 
   * // Note: For specific number types, consider using:
   * // setInt() for 32-bit integers
   * // setLong() for 64-bit integers
   * // setFloat() for single-precision decimals
   * // setDouble() for double-precision decimals
   */
  setNumber(key: string, value: number): MutableDocument {
    this._set(key, value);
    return this;
  }

    /**
   * Sets the revision ID for the document
   * @param {string} revisionID - The new revision ID to set
   * @example
   * const doc = new MutableDocument('user123');
   * doc.setRevisionID('1-abc123');
   * 
   * // Note: THIS METHOD IS  USED INTERNALLY ONLY - DO NOT SET THIS MANUALLY.
   * // Revision IDs ARE MANAGED AUTOMATICALLY BY THE DATABASE 
   */
  setRevisionID(revisionID: string) {
    this.revisionID = revisionID;
  }

      /**
   * Sets the sequence number for the document
   * @param {string} revisionID - The new sequence number to set
   * @example
   * const doc = new MutableDocument('user123');
   * doc.setSequence(123);
   * 
   * // Note: THIS METHOD IS  USED INTERNALLY ONLY - DO NOT SET THIS MANUALLY.
   * // SEQUENCE NUMBERS ARE MANAGED AUTOMATICALLY BY THE DATABASE 
   */
  setSequence(sequence: number) {
    this.sequenceNo = sequence;
  }

    /**
   * Sets a string value for a given key in the document
   * @param {string} key - The property key where the string will be stored
   * @param {string | null} value - The string value to store, or null to remove the value
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set a string value
   * doc.setString('name', 'John Doe');
   * 
   * // Remove a string value
   * doc.setString('middleName', null);
   * 
   * // Chain with other methods
   * doc.setString('firstName', 'John')
   *    .setString('lastName', 'Doe')
   *    .setString('email', 'john@example.com');
   */
  setString(key: string, value: string | null): MutableDocument {
    this._set(key, value);
    return this;
  }

    /**
   * Sets a value of any type for a given key in the document
   * @param {string} key - The property key where the value will be stored
   * @param {T} value - The value to store
   * @template T - The type of the value being stored
   * @returns {MutableDocument} The current document instance for method chaining
   * @example
   * // Set values of different types
   * doc.setValue('name', 'John')
   *    .setValue('age', 30)
   *    .setValue('isActive', true)
   *    .setValue('scores', [85, 92, 78])
   *    .setValue('address', {
   *      street: '123 Main St',
   *      city: 'Boston'
   *    });
   * 
   * // Note: Consider using type-specific setters (setString, setNumber, etc.)
   * // when the type is known at development time
   */
  setValue<T>(key: string, value: T): MutableDocument {
    this._set(key, value);
    return this;
  }

    /**
   * Converts the document's blob attachments to a JSON string representation
   * @returns {string} A JSON string containing all blob attachments in the document
   * @example
   * // First, add some blobs to the document
   * const imageBlob = new Blob('image/jpeg', imageBytes);
   * const pdfBlob = new Blob('application/pdf', pdfBytes);
   * 
   * doc.setBlob('profile_image', imageBlob)
   *    .setBlob('resume', pdfBlob);
   * 
   * // Get JSON string of all blobs
   * const blobsJson = doc.blobsToJsonString();
   * // Returns: '{"profile_image":{"_type":"blob","data":{...}},"resume":{...}}'
   */
  blobsToJsonString(): string {
    return JSON.stringify(this._blobs);
  }
}
