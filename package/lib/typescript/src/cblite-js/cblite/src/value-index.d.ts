import { Expression } from './expression';
import { IndexType, AbstractIndex } from './abstract-index';
export declare class ValueIndex extends AbstractIndex {
    private indexItems;
    constructor(...indexItems: ValueIndexItem[]);
    type(): IndexType;
    language(): string;
    ignoreAccents(): boolean;
    items(): any[];
    toJson(): {
        type: string;
        items: any[];
    };
}
export declare class ValueIndexItem {
    expr: Expression;
    constructor(expr: Expression);
    /**
     * Creates a value index item with the given property.
     *
     * @param property the property name
     * @return The value index item
     */
    static property(property: string): ValueIndexItem;
    /**
     * Creates a value index item with the given property.
     *
     * @param expression The expression to index. Typically a property expression.
     * @return The value index item
     */
    static expression(expression: Expression): ValueIndexItem;
}
//# sourceMappingURL=value-index.d.ts.map