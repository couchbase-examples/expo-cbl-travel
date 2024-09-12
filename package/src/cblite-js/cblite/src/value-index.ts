import { Expression } from './expression';
import { IndexType, AbstractIndex } from './abstract-index';

export class ValueIndex extends AbstractIndex {
  private indexItems: ValueIndexItem[];

  constructor(...indexItems: ValueIndexItem[]) {
    super();
    this.indexItems = indexItems;
  }

  type(): IndexType {
    return IndexType.Value;
  }

  language(): string {
    return null;
  }

  ignoreAccents(): boolean {
    return false;
  }

  items(): any[] {
    const items: any[] = [];
    for (let item of this.indexItems) {
      items.push(item.expr.asJSON());
    }
    return items;
  }

  toJson() {
    return {
      type: 'value',
      items: this.items(),
    };
  }
}

export class ValueIndexItem {
  constructor(public expr: Expression) {}

  /**
   * Creates a value index item with the given property.
   *
   * @param property the property name
   * @return The value index item
   */
  public static property(property: string): ValueIndexItem {
    return new ValueIndexItem(Expression.property(property));
  }

  /**
   * Creates a value index item with the given property.
   *
   * @param expression The expression to index. Typically a property expression.
   * @return The value index item
   */
  public static expression(expression: Expression): ValueIndexItem {
    return new ValueIndexItem(expression);
  }
}
