import { Expression } from './expression';

export abstract class Ordering {
  static property(property: string): SortOrder {
    return this.expression(Expression.property(property));
  }

  static expression(expression: Expression): SortOrder {
    return new SortOrder(expression);
  }

  abstract asJSON(): any;
}

export class SortOrder extends Ordering {
  isAscending = true;
  constructor(private expression: Expression) {
    super();
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
