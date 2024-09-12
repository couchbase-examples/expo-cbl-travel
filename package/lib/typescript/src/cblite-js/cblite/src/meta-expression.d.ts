import { Expression } from './expression';
export declare class MetaExpression extends Expression {
    private _keyPath;
    private _columnName;
    private _from;
    constructor(_keyPath: string, _columnName: string, _from: string);
    from(alias: string): MetaExpression;
    asJSON(): any[];
    getColumnName(): string;
}
//# sourceMappingURL=meta-expression.d.ts.map