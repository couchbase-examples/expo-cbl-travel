"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VariableExpression = void 0;
var _expression = require("./expression.js");
class VariableExpression extends _expression.Expression {
  // eslint-disable-next-line
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
//# sourceMappingURL=variable-expression.js.map