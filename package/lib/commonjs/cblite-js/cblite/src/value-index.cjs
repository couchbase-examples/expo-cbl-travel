"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValueIndexItem = exports.ValueIndex = void 0;
var _expression = require("./expression.cjs");
var _abstractIndex = require("./abstract-index.cjs");
class ValueIndex extends _abstractIndex.AbstractIndex {
  constructor(...indexItems) {
    super();
    this.indexItems = indexItems;
  }
  type() {
    return _abstractIndex.IndexType.Value;
  }
  language() {
    return null;
  }
  ignoreAccents() {
    return false;
  }
  items() {
    const items = [];
    for (let item of this.indexItems) {
      items.push(item.expr.asJSON());
    }
    return items;
  }
  toJson() {
    return {
      type: 'value',
      items: this.items()
    };
  }
}
exports.ValueIndex = ValueIndex;
class ValueIndexItem {
  constructor(expr) {
    this.expr = expr;
  }

  /**
   * Creates a value index item with the given property.
   *
   * @param property the property name
   * @return The value index item
   */
  static property(property) {
    return new ValueIndexItem(_expression.Expression.property(property));
  }

  /**
   * Creates a value index item with the given property.
   *
   * @param expression The expression to index. Typically a property expression.
   * @return The value index item
   */
  static expression(expression) {
    return new ValueIndexItem(expression);
  }
}
exports.ValueIndexItem = ValueIndexItem;
//# sourceMappingURL=value-index.cjs.map