export const __esModule: boolean;
/**
 * Full-text expression
 */
export class FullTextExpression {
    /**
     * Creates a full-text expression with the given full-text index name.
     *
     * @param name The full-text index name.
     * @return The full-text expression.
     */
    static index(name: any): FullTextExpression;
    constructor(name: any);
    name: any;
    /**
     * Creates a full-text match expression with the given search text.
     *
     * @param query The search text
     * @return The full-text match expression
     */
    match(query: any): FullTextMatchExpression;
}
export class FullTextMatchExpression extends _expression.Expression {
    constructor(indexName: any, text: any);
    indexName: any;
    text: any;
    asJSON(): any[];
}
import _expression = require("./expression.cjs");
//# sourceMappingURL=full-text-expression.d.cts.map