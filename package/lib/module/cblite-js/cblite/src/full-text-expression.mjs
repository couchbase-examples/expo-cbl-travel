import { Expression } from "./expression.mjs";

/**
 * Full-text expression
 */
export class FullTextExpression {
  constructor(name) {
    this.name = name;
  }
  /**
   * Creates a full-text expression with the given full-text index name.
   *
   * @param name The full-text index name.
   * @return The full-text expression.
   */
  static index(name) {
    return new FullTextExpression(name);
  }

  /**
   * Creates a full-text match expression with the given search text.
   *
   * @param query The search text
   * @return The full-text match expression
   */
  match(query) {
    return new FullTextMatchExpression(this.name, query);
  }
}
export class FullTextMatchExpression extends Expression {
  constructor(indexName, text) {
    super();
    this.indexName = indexName;
    this.text = text;
  }
  asJSON() {
    return ['MATCH()', this.indexName, this.text];
  }
}
//# sourceMappingURL=full-text-expression.mjs.map