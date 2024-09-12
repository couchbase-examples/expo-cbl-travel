"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parameters = void 0;
var _parameter = require("./parameter.cjs");
/**
 * A Parameters object used for setting values to the query parameters defined in the query.
 */
class Parameters {
  _parameters = {};
  setValue(name, value) {
    const parameter = new _parameter.Parameter();
    parameter.setValue(name, value);
    this._parameters[name] = parameter;
  }
  setString(name, value) {
    const parameter = new _parameter.Parameter();
    parameter.setString(name, value);
    this._parameters[name] = parameter;
  }
  setBoolean(name, value) {
    const parameter = new _parameter.Parameter();
    parameter.setBoolean(name, value);
    this._parameters[name] = parameter;
  }
  setFloat(name, value) {
    const parameter = new _parameter.Parameter();
    parameter.setFloat(name, value);
    this._parameters[name] = parameter;
  }
  setDouble(name, value) {
    const parameter = new _parameter.Parameter();
    parameter.setDouble(name, value);
    this._parameters[name] = parameter;
  }
  setLong(name, value) {
    const parameter = new _parameter.Parameter();
    parameter.setLong(name, value);
    this._parameters[name] = parameter;
  }
  setInt(name, value) {
    const parameter = new _parameter.Parameter();
    parameter.setInt(name, value);
    this._parameters[name] = parameter;
  }
  setDate(name, value) {
    const parameter = new _parameter.Parameter();
    parameter.setDate(name, value.toISOString());
    this._parameters[name] = parameter;
  }
  remove(name) {
    this._parameters[name] = null;
  }
  get() {
    if (Object.keys(this._parameters).length > 0) {
      return this._parameters;
    } else {
      return {};
    }
  }
}
exports.Parameters = Parameters;
//# sourceMappingURL=parameters.cjs.map