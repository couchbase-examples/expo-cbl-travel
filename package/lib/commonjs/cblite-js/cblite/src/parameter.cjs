"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parameter = void 0;
/**
 * A Parameters object used for setting values to the query parameters defined in the query.
 */
class Parameter {
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
exports.Parameter = Parameter;
//# sourceMappingURL=parameter.cjs.map