import { Collation } from './collation';
export declare abstract class Expression {
    abstract asJSON(): any[];
    static value(value: any): ValueExpression;
    static string(value: string): Expression;
    static number(value: number): ValueExpression;
    static intValue(value: number): ValueExpression;
    static longValue(value: number): ValueExpression;
    static floatValue(value: number): ValueExpression;
    static doubleValue(value: number): ValueExpression;
    static booleanValue(value: boolean): ValueExpression;
    static date(value: Date): ValueExpression;
    static all(): PropertyExpression;
    static property(property: string): PropertyExpression;
    static parameter(name: string): ParameterExpression;
    static negated(expression: Expression): CompoundExpression;
    static not(expression: Expression): CompoundExpression;
    multiply(expression: Expression): BinaryExpression;
    divide(expression: Expression): BinaryExpression;
    modulo(expression: Expression): BinaryExpression;
    /**
     * Create an add expression to add the given expression to the current expression
     */
    add(expression: Expression): BinaryExpression;
    subtract(expression: Expression): BinaryExpression;
    lessThan(expression: Expression): BinaryExpression;
    lessThanOrEqualTo(expression: Expression): BinaryExpression;
    greaterThan(expression: Expression): BinaryExpression;
    greaterThanOrEqualTo(expression: Expression): BinaryExpression;
    equalTo(expression: Expression): Expression;
    notEqualTo(expression: Expression): Expression;
    and(expression: Expression): CompoundExpression;
    or(expression: Expression): CompoundExpression;
    like(expression: Expression): BinaryExpression;
    regex(expression: Expression): BinaryExpression;
    is(expression: Expression): BinaryExpression;
    isNot(expression: Expression): BinaryExpression;
    between(expression1: Expression, expression2: Expression): BinaryExpression;
    isNullOrMissing(): Expression;
    notNullOrMissing(): Expression;
    collate(collation: Collation): CollationExpression;
    in(...expressions: Expression[]): Expression;
}
export declare class PropertyExpression extends Expression {
    private keyPath;
    private _from;
    private columnName;
    static kCBLAllPropertiesName: string;
    constructor(keyPath: string, _from?: string, columnName?: string);
    from(alias: string): PropertyExpression;
    static allFrom(from: string): PropertyExpression;
    asJSON(): any[];
    getColumnName(): string;
}
export declare class ValueExpression extends Expression {
    private value;
    constructor(value: any);
    asJSON(): any;
}
export declare enum BinaryOpType {
    Add = 0,
    Between = 1,
    Divide = 2,
    EqualTo = 3,
    GreaterThan = 4,
    GreaterThanOrEqualTo = 5,
    In = 6,
    Is = 7,
    IsNot = 8,
    LessThan = 9,
    LessThanOrEqualTo = 10,
    Like = 11,
    Modulus = 12,
    Multiply = 13,
    NotEqualTo = 14,
    Subtract = 15,
    RegexLike = 16
}
export declare class BinaryExpression extends Expression {
    private lhs;
    private rhs;
    private type;
    static readonly OpType: typeof BinaryOpType;
    constructor(lhs: Expression, rhs: Expression, type: BinaryOpType);
    asJSON(): any[];
}
export declare class AggregateExpression extends Expression {
    private expressions;
    constructor(expressions: Expression[]);
    getExpressions(): Expression[];
    asJSON(): any[];
}
export declare class ParameterExpression extends Expression {
    private name;
    constructor(name: string);
    asJSON(): string[];
}
export declare enum CompoundExpressionOpType {
    And = 0,
    Or = 1,
    Not = 2
}
export declare class CompoundExpression extends Expression {
    private subexpressions;
    private type;
    static readonly OpType: typeof CompoundExpressionOpType;
    constructor(subexpressions: Expression[], type: CompoundExpressionOpType);
    asJSON(): any[];
}
export declare enum UnaryExpressionOpType {
    Missing = 0,
    NotMissing = 1,
    NotNull = 2,
    Null = 3
}
export declare class UnaryExpression extends Expression {
    private operand;
    private type;
    static readonly OpType: typeof UnaryExpressionOpType;
    constructor(operand: Expression, type: UnaryExpressionOpType);
    asJSON(): (string | any[])[];
}
export declare class CollationExpression extends Expression {
    private operand;
    private collation;
    constructor(operand: Expression, collation: Collation);
    asJSON(): any[];
}
export declare class FunctionExpression extends Expression {
    private func;
    private params;
    constructor(func: string, params: Expression[]);
    asJSON(): any[];
}
//# sourceMappingURL=expression.d.ts.map