"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetaExpression = void 0;
var _expression = require("./expression.cjs");
class MetaExpression extends _expression.Expression {
  constructor(_keyPath, _columnName, _from) {
    super();
    this._keyPath = _keyPath;
    this._columnName = _columnName;
    this._from = _from;
  }
  from(alias) {
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
exports.MetaExpression = MetaExpression;
//# sourceMappingURL=meta-expression.cjs.map