export class Ordering {
    static property(property: any): SortOrder;
    static expression(expression: any): SortOrder;
}
export class SortOrder extends Ordering {
    constructor(expression: any);
    isAscending: boolean;
    expression: any;
    ascending(): this;
    descending(): this;
    asJSON(): any;
}
//# sourceMappingURL=ordering.d.mts.map