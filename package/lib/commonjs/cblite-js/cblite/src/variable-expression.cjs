"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VariableExpression = void 0;
var _expression = require("./expression.cjs");
class VariableExpression extends _expression.Expression {
  constructor(name) {
    super();
    this.name = name;
  }
  getName() {
    return this.name;
  }
  asJSON() {
    return ['?' + this.name];
  }
}
exports.VariableExpression = VariableExpression;
//# sourceMappingURL=variable-expression.cjs.map