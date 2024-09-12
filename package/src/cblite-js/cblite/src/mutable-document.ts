import { Document } from './document';
import { Dictionary } from './definitions';
import { Blob } from './blob';

export class MutableDocument extends Document {
  constructor(
    id: string = null,
    sequenceNo: number = null,
    data: Dictionary = {}
  ) {
    super(id, sequenceNo, data);
  }

  static fromDocument(document: Document) {
    return new MutableDocument(
      document.getId(),
      document.getSequence(),
      document.getData()
    );
  }

  remove(key: string): MutableDocument {
    delete this.doc[key];
    return this;
  }

  _set(key: string, value: any | null) {
    this.doc[key] = value;
  }

  setId(id: string) {
    // this._set('_id', id);
    this.id = id;
  }

  setArray(key: string, value: any[]): MutableDocument {
    this._set(key, value);
    return this;
  }

  setBlob(key: string, value: Blob | null): MutableDocument {
    if (value === null) {
      this._set(key, null);
      return this;
    }
    this._set(key, {
      _type: 'blob',
      data: value.toDictionary(),
    });
    return this;
  }

  setBoolean(key: string, value: boolean): MutableDocument {
    this._set(key, value);
    return this;
  }

  setData(data: Dictionary): MutableDocument {
    this.doc = data;
    return this;
  }

  setDate(key: string, value: Date | null): MutableDocument {
    if (value !== null) {
      this._set(key, value.toISOString());
    } else {
      this._set(key, value);
    }
    return this;
  }

  setDictionary(key: string, value: Dictionary | null): MutableDocument {
    this._set(key, value);
    return this;
  }

  setDouble(key: string, value: number): MutableDocument {
    this._set(key, value);
    return this;
  }

  setFloat(key: string, value: number): MutableDocument {
    this._set(key, value);
    return this;
  }

  setInt(key: string, value: number): MutableDocument {
    this._set(key, value);
    return this;
  }

  setLong(key: string, value: number): MutableDocument {
    this._set(key, value);
    return this;
  }

  setNumber(key: string, value: number): MutableDocument {
    this._set(key, value);
    return this;
  }

  setString(key: string, value: string | null): MutableDocument {
    this._set(key, value);
    return this;
  }

  setValue(key: string, value: any): MutableDocument {
    this._set(key, value);
    return this;
  }
}
