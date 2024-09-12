import { Expression } from './expression';
export declare abstract class Ordering {
    static property(property: string): SortOrder;
    static expression(expression: Expression): SortOrder;
    abstract asJSON(): any;
}
export declare class SortOrder extends Ordering {
    private expression;
    isAscending: boolean;
    constructor(expression: Expression);
    ascending(): this;
    descending(): this;
    asJSON(): any[];
}
//# sourceMappingURL=ordering.d.ts.map