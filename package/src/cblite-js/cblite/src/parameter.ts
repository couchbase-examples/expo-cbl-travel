/**
 * A Parameters object used for setting values to the query parameters defined in the query.
 */
export class Parameter {
  name: string;
  value: any;
  type: string;

  private _set(name: string, value: any | null, type: string) {
    this.name = name;
    this.value = value;
    this.type = type;
  }

  setValue(name: string, value: any | null) {
    this._set(name, value, 'value');
  }

  setString(name: string, value: string | null) {
    this._set(name, value, 'string');
  }

  setBoolean(name: string, value: boolean) {
    this._set(name, value, 'boolean');
  }

  setFloat(name: string, value: number) {
    this._set(name, value, 'float');
  }

  setDouble(name: string, value: number) {
    this._set(name, value, 'double');
  }

  setLong(name: string, value: number) {
    this._set(name, value, 'long');
  }

  setInt(name: string, value: number) {
    this._set(name, value, 'int');
  }

  setDate(name: string, value: string | null) {
    this._set(name, value, 'date');
  }

  get() {
    return this;
  }
}
