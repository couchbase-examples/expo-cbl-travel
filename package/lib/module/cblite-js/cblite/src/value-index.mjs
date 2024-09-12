import { Expression } from "./expression.mjs";
import { IndexType, AbstractIndex } from "./abstract-index.mjs";
export class ValueIndex extends AbstractIndex {
  constructor(...indexItems) {
    super();
    this.indexItems = indexItems;
  }
  type() {
    return IndexType.Value;
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
export class ValueIndexItem {
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
    return new ValueIndexItem(Expression.property(property));
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
//# sourceMappingURL=value-index.mjs.map