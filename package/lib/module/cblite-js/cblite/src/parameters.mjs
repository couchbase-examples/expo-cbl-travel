import { Parameter } from "./parameter.mjs";
/**
 * A Parameters object used for setting values to the query parameters defined in the query.
 */
export class Parameters {
  _parameters = {};
  setValue(name, value) {
    const parameter = new Parameter();
    parameter.setValue(name, value);
    this._parameters[name] = parameter;
  }
  setString(name, value) {
    const parameter = new Parameter();
    parameter.setString(name, value);
    this._parameters[name] = parameter;
  }
  setBoolean(name, value) {
    const parameter = new Parameter();
    parameter.setBoolean(name, value);
    this._parameters[name] = parameter;
  }
  setFloat(name, value) {
    const parameter = new Parameter();
    parameter.setFloat(name, value);
    this._parameters[name] = parameter;
  }
  setDouble(name, value) {
    const parameter = new Parameter();
    parameter.setDouble(name, value);
    this._parameters[name] = parameter;
  }
  setLong(name, value) {
    const parameter = new Parameter();
    parameter.setLong(name, value);
    this._parameters[name] = parameter;
  }
  setInt(name, value) {
    const parameter = new Parameter();
    parameter.setInt(name, value);
    this._parameters[name] = parameter;
  }
  setDate(name, value) {
    const parameter = new Parameter();
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
//# sourceMappingURL=parameters.mjs.map