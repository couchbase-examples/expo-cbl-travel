import { Expression } from './expression';

/**
 * Full-text expression
 */
export class FullTextExpression {
  private constructor(private name: string) {}
  /**
   * Creates a full-text expression with the given full-text index name.
   *
   * @param name The full-text index name.
   * @return The full-text expression.
   */
  public static index(name: string): FullTextExpression {
    return new FullTextExpression(name);
  }

  /**
   * Creates a full-text match expression with the given search text.
   *
   * @param query The search text
   * @return The full-text match expression
   */
  public match(query: string): Expression {
    return new FullTextMatchExpression(this.name, query);
  }
}

export class FullTextMatchExpression extends Expression {
  constructor(
    private indexName: string,
    private text: string
  ) {
    super();
  }

  asJSON(): any {
    return ['MATCH()', this.indexName, this.text];
  }
}
