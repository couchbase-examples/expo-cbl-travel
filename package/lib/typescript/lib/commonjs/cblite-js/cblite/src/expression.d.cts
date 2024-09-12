export const __esModule: boolean;
export const BinaryOpType: {};
export const CompoundExpressionOpType: {};
export const UnaryExpressionOpType: {};
export class Expression {
    static value(value: any): ValueExpression;
    static string(value: any): ValueExpression;
    static number(value: any): ValueExpression;
    static intValue(value: any): ValueExpression;
    static longValue(value: any): ValueExpression;
    static floatValue(value: any): ValueExpression;
    static doubleValue(value: any): ValueExpression;
    static booleanValue(value: any): ValueExpression;
    static date(value: any): ValueExpression;
    static all(): PropertyExpression;
    static property(property: any): PropertyExpression;
    static parameter(name: any): ParameterExpression;
    static negated(expression: any): CompoundExpression;
    static not(expression: any): CompoundExpression;
    multiply(expression: any): BinaryExpression;
    divide(expression: any): BinaryExpression;
    modulo(expression: any): BinaryExpression;
    /**
     * Create an add expression to add the given expression to the current expression
     */
    add(expression: any): BinaryExpression;
    subtract(expression: any): BinaryExpression;
    lessThan(expression: any): BinaryExpression;
    lessThanOrEqualTo(expression: any): BinaryExpression;
    greaterThan(expression: any): BinaryExpression;
    greaterThanOrEqualTo(expression: any): BinaryExpression;
    equalTo(expression: any): BinaryExpression;
    notEqualTo(expression: any): BinaryExpression;
    and(expression: any): CompoundExpression;
    or(expression: any): CompoundExpression;
    like(expression: any): BinaryExpression;
    regex(expression: any): BinaryExpression;
    is(expression: any): BinaryExpression;
    isNot(expression: any): BinaryExpression;
    between(expression1: any, expression2: any): BinaryExpression;
    isNullOrMissing(): CompoundExpression;
    notNullOrMissing(): CompoundExpression;
    collate(collation: any): CollationExpression;
    in(...expressions: any[]): BinaryExpression;
}
export class PropertyExpression extends Expression {
    static kCBLAllPropertiesName: string;
    static allFrom(from: any): PropertyExpression;
    constructor(keyPath: any, _from?: string, columnName?: string);
    keyPath: any;
    _from: string;
    columnName: string;
    from(alias: any): PropertyExpression;
    asJSON(): string[];
    getColumnName(): string;
}
export class ValueExpression extends Expression {
    constructor(value: any);
    value: any;
    asJSON(): any;
}
export class BinaryExpression extends Expression {
    static OpType: {};
    constructor(lhs: any, rhs: any, type: any);
    lhs: any;
    rhs: any;
    type: any;
    asJSON(): any[];
}
export class AggregateExpression extends Expression {
    constructor(expressions: any);
    expressions: any;
    getExpressions(): any;
    asJSON(): any[];
}
export class ParameterExpression extends Expression {
    constructor(name: any);
    name: any;
    asJSON(): string[];
}
export class CompoundExpression extends Expression {
    static OpType: {};
    constructor(subexpressions: any, type: any);
    subexpressions: any;
    type: any;
    asJSON(): any[];
}
export class UnaryExpression extends Expression {
    static OpType: {};
    constructor(operand: any, type: any);
    operand: any;
    type: any;
    asJSON(): any[];
}
export class CollationExpression extends Expression {
    constructor(operand: any, collation: any);
    operand: any;
    collation: any;
    asJSON(): any[];
}
export class FunctionExpression extends Expression {
    constructor(func: any, params: any);
    func: any;
    params: any;
    asJSON(): any[];
}
//# sourceMappingURL=expression.d.cts.map