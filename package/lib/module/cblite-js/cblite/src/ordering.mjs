import { Expression } from "./expression.mjs";
export class Ordering {
  static property(property) {
    return this.expression(Expression.property(property));
  }
  static expression(expression) {
    return new SortOrder(expression);
  }
}
export class SortOrder extends Ordering {
  isAscending = true;
  constructor(expression) {
    super();
    this.expression = expression;
  }
  ascending() {
    this.isAscending = true;
    return this;
  }
  descending() {
    this.isAscending = false;
    return this;
  }
  asJSON() {
    if (this.isAscending) {
      return this.expression.asJSON();
    }
    return ['DESC', this.expression.asJSON()];
  }
}
//# sourceMappingURL=ordering.mjs.map