"use strict";

import { Expression } from "./expression.js";
export class VariableExpression extends Expression {
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
//# sourceMappingURL=variable-expression.js.map