"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FullTextMatchExpression = exports.FullTextExpression = void 0;
var _expression = require("./expression.cjs");
/**
 * Full-text expression
 */
class FullTextExpression {
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
exports.FullTextExpression = FullTextExpression;
class FullTextMatchExpression extends _expression.Expression {
  constructor(indexName, text) {
    super();
    this.indexName = indexName;
    this.text = text;
  }
  asJSON() {
    return ['MATCH()', this.indexName, this.text];
  }
}
exports.FullTextMatchExpression = FullTextMatchExpression;
//# sourceMappingURL=full-text-expression.cjs.map