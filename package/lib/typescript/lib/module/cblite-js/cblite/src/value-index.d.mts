export class ValueIndex extends AbstractIndex {
    constructor(...indexItems: any[]);
    indexItems: any[];
    type(): any;
    language(): any;
    ignoreAccents(): boolean;
    items(): any[];
    toJson(): {
        type: string;
        items: any[];
    };
}
export class ValueIndexItem {
    /**
     * Creates a value index item with the given property.
     *
     * @param property the property name
     * @return The value index item
     */
    static property(property: any): ValueIndexItem;
    /**
     * Creates a value index item with the given property.
     *
     * @param expression The expression to index. Typically a property expression.
     * @return The value index item
     */
    static expression(expression: any): ValueIndexItem;
    constructor(expr: any);
    expr: any;
}
import { AbstractIndex } from "./abstract-index.mjs";
//# sourceMappingURL=value-index.d.mts.map