import { Expression } from './expression';
/**
 * Full-text expression
 */
export declare class FullTextExpression {
    private name;
    private constructor();
    /**
     * Creates a full-text expression with the given full-text index name.
     *
     * @param name The full-text index name.
     * @return The full-text expression.
     */
    static index(name: string): FullTextExpression;
    /**
     * Creates a full-text match expression with the given search text.
     *
     * @param query The search text
     * @return The full-text match expression
     */
    match(query: string): Expression;
}
export declare class FullTextMatchExpression extends Expression {
    private indexName;
    private text;
    constructor(indexName: string, text: string);
    asJSON(): any;
}
//# sourceMappingURL=full-text-expression.d.ts.map