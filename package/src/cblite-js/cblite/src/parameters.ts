import { Parameter } from './parameter';
import { Dictionary } from './definitions';

/**
 * A Parameters object used for setting values to the query parameters defined in the query.
 */
export class Parameters {
  private _parameters: Dictionary = {};

  setValue(name: string, value: any) {
    const parameter = new Parameter();
    parameter.setValue(name, value);
    this._parameters[name] = parameter;
  }

  setString(name: string, value: string) {
    const parameter = new Parameter();
    parameter.setString(name, value);
    this._parameters[name] = parameter;
  }

  setBoolean(name: string, value: boolean) {
    const parameter = new Parameter();
    parameter.setBoolean(name, value);
    this._parameters[name] = parameter;
  }

  setFloat(name: string, value: number) {
    const parameter = new Parameter();
    parameter.setFloat(name, value);
    this._parameters[name] = parameter;
  }

  setDouble(name: string, value: number) {
    const parameter = new Parameter();
    parameter.setDouble(name, value);
    this._parameters[name] = parameter;
  }

  setLong(name: string, value: number) {
    const parameter = new Parameter();
    parameter.setLong(name, value);
    this._parameters[name] = parameter;
  }

  setInt(name: string, value: number) {
    const parameter = new Parameter();
    parameter.setInt(name, value);
    this._parameters[name] = parameter;
  }

  setDate(name: string, value: Date) {
    const parameter = new Parameter();
    parameter.setDate(name, value.toISOString());
    this._parameters[name] = parameter;
  }

  remove(name: string) {
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
