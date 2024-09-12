export class MetaExpression extends Expression {
    constructor(_keyPath: any, _columnName: any, _from: any);
    _keyPath: any;
    _columnName: any;
    _from: any;
    from(alias: any): MetaExpression;
    asJSON(): string[];
    getColumnName(): any;
}
import { Expression } from "./expression.mjs";
//# sourceMappingURL=meta-expression.d.mts.map