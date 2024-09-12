import { Collation } from './collation';

export abstract class Expression {
  abstract asJSON(): any[];

  static value(value: any) {
    return new ValueExpression(value);
  }

  static string(value: string): Expression {
    return new ValueExpression(value);
  }

  static number(value: number) {
    return new ValueExpression(value);
  }

  static intValue(value: number) {
    return new ValueExpression(value);
  }

  static longValue(value: number) {
    return new ValueExpression(value);
  }

  static floatValue(value: number) {
    return new ValueExpression(value);
  }

  static doubleValue(value: number) {
    return new ValueExpression(value);
  }

  static booleanValue(value: boolean) {
    return new ValueExpression(value);
  }

  static date(value: Date) {
    return new ValueExpression(value);
  }

  static all() {
    return new PropertyExpression('*');
  }

  static property(property: string): PropertyExpression {
    return new PropertyExpression(property);
  }

  static parameter(name: string) {
    return new ParameterExpression(name);
  }

  static negated(expression: Expression) {
    return new CompoundExpression([expression], CompoundExpression.OpType.Not);
  }

  static not(expression: Expression) {
    return Expression.negated(expression);
  }

  multiply(expression: Expression) {
    return new BinaryExpression(this, expression, BinaryOpType.Multiply);
  }

  divide(expression: Expression) {
    return new BinaryExpression(this, expression, BinaryOpType.Divide);
  }

  modulo(expression: Expression) {
    return new BinaryExpression(this, expression, BinaryOpType.Modulus);
  }

  /**
   * Create an add expression to add the given expression to the current expression
   */
  add(expression: Expression) {
    return new BinaryExpression(this, expression, BinaryOpType.Add);
  }

  subtract(expression: Expression) {
    return new BinaryExpression(this, expression, BinaryOpType.Subtract);
  }

  lessThan(expression: Expression) {
    return new BinaryExpression(this, expression, BinaryOpType.LessThan);
  }

  lessThanOrEqualTo(expression: Expression) {
    return new BinaryExpression(
      this,
      expression,
      BinaryOpType.LessThanOrEqualTo
    );
  }

  greaterThan(expression: Expression) {
    return new BinaryExpression(this, expression, BinaryOpType.GreaterThan);
  }

  greaterThanOrEqualTo(expression: Expression) {
    return new BinaryExpression(
      this,
      expression,
      BinaryOpType.GreaterThanOrEqualTo
    );
  }

  equalTo(expression: Expression): Expression {
    return new BinaryExpression(
      this,
      expression,
      BinaryExpression.OpType.EqualTo
    );
  }

  notEqualTo(expression: Expression): Expression {
    return new BinaryExpression(
      this,
      expression,
      BinaryExpression.OpType.NotEqualTo
    );
  }

  and(expression: Expression) {
    return new CompoundExpression(
      [this, expression],
      CompoundExpressionOpType.And
    );
  }

  or(expression: Expression) {
    return new CompoundExpression(
      [this, expression],
      CompoundExpressionOpType.Or
    );
  }

  like(expression: Expression) {
    return new BinaryExpression(this, expression, BinaryExpression.OpType.Like);
  }

  regex(expression: Expression) {
    return new BinaryExpression(
      this,
      expression,
      BinaryExpression.OpType.RegexLike
    );
  }

  is(expression: Expression) {
    return new BinaryExpression(this, expression, BinaryExpression.OpType.Is);
  }

  isNot(expression: Expression) {
    return new BinaryExpression(
      this,
      expression,
      BinaryExpression.OpType.IsNot
    );
  }

  between(expression1: Expression, expression2: Expression): BinaryExpression {
    const aggr = new AggregateExpression([expression1, expression2]);
    return new BinaryExpression(this, aggr, BinaryExpression.OpType.Between);
  }

  isNullOrMissing(): Expression {
    return new UnaryExpression(this, UnaryExpression.OpType.Null).or(
      new UnaryExpression(this, UnaryExpression.OpType.Missing)
    );
  }

  notNullOrMissing(): Expression {
    return Expression.negated(this.isNullOrMissing());
  }

  collate(collation: Collation) {
    return new CollationExpression(this, collation);
  }

  in(...expressions: Expression[]): Expression {
    const aggr = new AggregateExpression(expressions);
    return new BinaryExpression(this, aggr, BinaryExpression.OpType.In);
  }
}

export class PropertyExpression extends Expression {
  static kCBLAllPropertiesName = '';

  constructor(
    private keyPath: string,
    private _from: string = '',
    private columnName: string = ''
  ) {
    super();
  }

  from(alias: string) {
    return new PropertyExpression(this.keyPath, alias);
  }

  static allFrom(from: string) {
    const colName = from || PropertyExpression.kCBLAllPropertiesName;
    return new PropertyExpression(
      PropertyExpression.kCBLAllPropertiesName,
      from,
      colName
    );
  }

  asJSON() {
    const json = [];
    if (this._from !== null && this._from !== '') {
      json.push('.' + this._from + '.' + this.keyPath);
    } else {
      json.push('.' + this.keyPath);
    }
    return json;
  }

  getColumnName() {
    if (!this.columnName) {
      const paths = this.keyPath.split('.');
      this.columnName = paths.pop();
    }
    return this.columnName;
  }
}

export class ValueExpression extends Expression {
  constructor(private value: any) {
    super();
  }

  asJSON() {
    if (this.value instanceof Date) {
      return (this.value as Date).toISOString();
    } else {
      return this.value;
    }
  }

  /*
  private isSupportedType(value: any) {
    return (value == null
            || value instanceof String
            || value instanceof Number   // including int, long, float, double
            || value instanceof Boolean
            || value instanceof Date);
  }
  */
}

export enum BinaryOpType {
  Add,
  Between,
  Divide,
  EqualTo,
  GreaterThan,
  GreaterThanOrEqualTo,
  In,
  Is,
  IsNot,
  LessThan,
  LessThanOrEqualTo,
  Like,
  Modulus,
  Multiply,
  NotEqualTo,
  Subtract,
  RegexLike,
}

export class BinaryExpression extends Expression {
  static readonly OpType = BinaryOpType;

  constructor(
    private lhs: Expression,
    private rhs: Expression,
    private type: BinaryOpType
  ) {
    super();
  }

  asJSON() {
    const json = [];
    switch (this.type) {
      case BinaryOpType.Add:
        json.push('+');
        break;
      case BinaryOpType.Between:
        json.push('BETWEEN');
        break;
      case BinaryOpType.Divide:
        json.push('/');
        break;
      case BinaryOpType.EqualTo:
        json.push('=');
        break;
      case BinaryOpType.GreaterThan:
        json.push('>');
        break;
      case BinaryOpType.GreaterThanOrEqualTo:
        json.push('>=');
        break;
      case BinaryOpType.In:
        json.push('IN');
        break;
      case BinaryOpType.Is:
        json.push('IS');
        break;
      case BinaryOpType.IsNot:
        json.push('IS NOT');
        break;
      case BinaryOpType.LessThan:
        json.push('<');
        break;
      case BinaryOpType.LessThanOrEqualTo:
        json.push('<=');
        break;
      case BinaryOpType.Like:
        json.push('LIKE');
        break;
      case BinaryOpType.Modulus:
        json.push('%');
        break;
      case BinaryOpType.Multiply:
        json.push('*');
        break;
      case BinaryOpType.NotEqualTo:
        json.push('!=');
        break;
      case BinaryOpType.RegexLike:
        json.push('regexp_like()');
        break;
      case BinaryOpType.Subtract:
        json.push('-');
        break;
    }

    json.push(this.lhs.asJSON());

    if (this.type === BinaryOpType.Between) {
      // "between"'s RHS is an aggregate of the min and max, but the min and max need to be
      // written out as parameters to the BETWEEN operation:
      const rangeExprs = (this.rhs as AggregateExpression).getExpressions();
      json.push(rangeExprs[0].asJSON());
      json.push(rangeExprs[1].asJSON());
    } else {
      json.push(this.rhs.asJSON());
    }

    return json;
  }
}

export class AggregateExpression extends Expression {
  constructor(private expressions: Expression[]) {
    super();
  }

  getExpressions() {
    return this.expressions;
  }

  asJSON() {
    const json = [];
    json.push('[]');
    for (let expr of this.expressions) {
      json.push(expr.asJSON());
    }
    return json;
  }
}

export class ParameterExpression extends Expression {
  constructor(private name: string) {
    super();
  }

  asJSON() {
    return ['$' + this.name];
  }
}

export enum CompoundExpressionOpType {
  And,
  Or,
  Not,
}

export class CompoundExpression extends Expression {
  static readonly OpType = CompoundExpressionOpType;

  constructor(
    private subexpressions: Expression[],
    private type: CompoundExpressionOpType
  ) {
    super();
  }

  asJSON() {
    const json = [];
    switch (this.type) {
      case CompoundExpressionOpType.And:
        json.push('AND');
        break;
      case CompoundExpressionOpType.Or:
        json.push('OR');
        break;
      case CompoundExpressionOpType.Not:
        json.push('NOT');
        break;
    }

    json.push(...this.subexpressions.map((s) => s.asJSON()));
    return json;
  }
}

export enum UnaryExpressionOpType {
  Missing,
  NotMissing,
  NotNull,
  Null,
}

export class UnaryExpression extends Expression {
  static readonly OpType = UnaryExpressionOpType;

  constructor(
    private operand: Expression,
    private type: UnaryExpressionOpType
  ) {
    super();
    if (operand == null) throw new Error('operand is null.');
  }

  asJSON() {
    const opd = this.operand.asJSON();
    switch (this.type) {
      case UnaryExpressionOpType.Missing: {
        return ['IS', opd, ['MISSING']];
      }
      case UnaryExpressionOpType.NotMissing: {
        return ['IS NOT', opd, ['MISSING']];
      }
      case UnaryExpressionOpType.Null: {
        return ['IS', opd, null];
      }
      case UnaryExpressionOpType.NotNull: {
        return ['IS NOT', opd, null];
      }
      default:
        return [];
    }
  }
}

export class CollationExpression extends Expression {
  constructor(
    private operand: Expression,
    private collation: Collation
  ) {
    super();
  }

  asJSON() {
    return ['COLLATE', this.collation.asJSON(), this.operand.asJSON()];
  }
}

export class FunctionExpression extends Expression {
  constructor(
    private func: string,
    private params: Expression[]
  ) {
    super();
  }
  asJSON() {
    const json: any[] = [this.func];
    json.push(...this.params.map((p) => p.asJSON()));
    return json;
  }
}
