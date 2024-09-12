import { Expression } from "./expression.mjs";
export class VariableExpression extends Expression {
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
//# sourceMappingURL=variable-expression.mjs.map