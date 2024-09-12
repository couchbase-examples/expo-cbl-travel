"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortOrder = exports.Ordering = void 0;
var _expression = require("./expression.cjs");
class Ordering {
  static property(property) {
    return this.expression(_expression.Expression.property(property));
  }
  static expression(expression) {
    return new SortOrder(expression);
  }
}
exports.Ordering = Ordering;
class SortOrder extends Ordering {
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
exports.SortOrder = SortOrder;
//# sourceMappingURL=ordering.cjs.map