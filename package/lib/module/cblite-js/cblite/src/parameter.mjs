/**
 * A Parameters object used for setting values to the query parameters defined in the query.
 */
export class Parameter {
  _set(name, value, type) {
    this.name = name;
    this.value = value;
    this.type = type;
  }
  setValue(name, value) {
    this._set(name, value, 'value');
  }
  setString(name, value) {
    this._set(name, value, 'string');
  }
  setBoolean(name, value) {
    this._set(name, value, 'boolean');
  }
  setFloat(name, value) {
    this._set(name, value, 'float');
  }
  setDouble(name, value) {
    this._set(name, value, 'double');
  }
  setLong(name, value) {
    this._set(name, value, 'long');
  }
  setInt(name, value) {
    this._set(name, value, 'int');
  }
  setDate(name, value) {
    this._set(name, value, 'date');
  }
  get() {
    return this;
  }
}
//# sourceMappingURL=parameter.mjs.map