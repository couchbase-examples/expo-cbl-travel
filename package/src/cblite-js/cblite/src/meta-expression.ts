import { Expression } from './expression';

export class MetaExpression extends Expression {
  constructor(
    private _keyPath: string,
    private _columnName: string,
    private _from: string
  ) {
    super();
  }

  from(alias: string) {
    return new MetaExpression(this._keyPath, null, alias);
  }

  asJSON() {
    const json = [];
    if (this._from) {
      json.push('.' + this._from + '.' + this._keyPath);
    } else {
      json.push('.' + this._keyPath);
    }
    return json;
  }

  getColumnName() {
    if (!this._columnName) {
      const paths = this._keyPath.split('.');
      this._columnName = paths[paths.length - 1];
    }
    return this._columnName;
  }
}
