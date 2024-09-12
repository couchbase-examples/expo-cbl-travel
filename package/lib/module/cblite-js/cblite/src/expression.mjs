export class Expression {
  static value(value) {
    return new ValueExpression(value);
  }
  static string(value) {
    return new ValueExpression(value);
  }
  static number(value) {
    return new ValueExpression(value);
  }
  static intValue(value) {
    return new ValueExpression(value);
  }
  static longValue(value) {
    return new ValueExpression(value);
  }
  static floatValue(value) {
    return new ValueExpression(value);
  }
  static doubleValue(value) {
    return new ValueExpression(value);
  }
  static booleanValue(value) {
    return new ValueExpression(value);
  }
  static date(value) {
    return new ValueExpression(value);
  }
  static all() {
    return new PropertyExpression('*');
  }
  static property(property) {
    return new PropertyExpression(property);
  }
  static parameter(name) {
    return new ParameterExpression(name);
  }
  static negated(expression) {
    return new CompoundExpression([expression], CompoundExpression.OpType.Not);
  }
  static not(expression) {
    return Expression.negated(expression);
  }
  multiply(expression) {
    return new BinaryExpression(this, expression, BinaryOpType.Multiply);
  }
  divide(expression) {
    return new BinaryExpression(this, expression, BinaryOpType.Divide);
  }
  modulo(expression) {
    return new BinaryExpression(this, expression, BinaryOpType.Modulus);
  }

  /**
   * Create an add expression to add the given expression to the current expression
   */
  add(expression) {
    return new BinaryExpression(this, expression, BinaryOpType.Add);
  }
  subtract(expression) {
    return new BinaryExpression(this, expression, BinaryOpType.Subtract);
  }
  lessThan(expression) {
    return new BinaryExpression(this, expression, BinaryOpType.LessThan);
  }
  lessThanOrEqualTo(expression) {
    return new BinaryExpression(this, expression, BinaryOpType.LessThanOrEqualTo);
  }
  greaterThan(expression) {
    return new BinaryExpression(this, expression, BinaryOpType.GreaterThan);
  }
  greaterThanOrEqualTo(expression) {
    return new BinaryExpression(this, expression, BinaryOpType.GreaterThanOrEqualTo);
  }
  equalTo(expression) {
    return new BinaryExpression(this, expression, BinaryExpression.OpType.EqualTo);
  }
  notEqualTo(expression) {
    return new BinaryExpression(this, expression, BinaryExpression.OpType.NotEqualTo);
  }
  and(expression) {
    return new CompoundExpression([this, expression], CompoundExpressionOpType.And);
  }
  or(expression) {
    return new CompoundExpression([this, expression], CompoundExpressionOpType.Or);
  }
  like(expression) {
    return new BinaryExpression(this, expression, BinaryExpression.OpType.Like);
  }
  regex(expression) {
    return new BinaryExpression(this, expression, BinaryExpression.OpType.RegexLike);
  }
  is(expression) {
    return new BinaryExpression(this, expression, BinaryExpression.OpType.Is);
  }
  isNot(expression) {
    return new BinaryExpression(this, expression, BinaryExpression.OpType.IsNot);
  }
  between(expression1, expression2) {
    const aggr = new AggregateExpression([expression1, expression2]);
    return new BinaryExpression(this, aggr, BinaryExpression.OpType.Between);
  }
  isNullOrMissing() {
    return new UnaryExpression(this, UnaryExpression.OpType.Null).or(new UnaryExpression(this, UnaryExpression.OpType.Missing));
  }
  notNullOrMissing() {
    return Expression.negated(this.isNullOrMissing());
  }
  collate(collation) {
    return new CollationExpression(this, collation);
  }
  in(...expressions) {
    const aggr = new AggregateExpression(expressions);
    return new BinaryExpression(this, aggr, BinaryExpression.OpType.In);
  }
}
export class PropertyExpression extends Expression {
  static kCBLAllPropertiesName = '';
  constructor(keyPath, _from = '', columnName = '') {
    super();
    this.keyPath = keyPath;
    this._from = _from;
    this.columnName = columnName;
  }
  from(alias) {
    return new PropertyExpression(this.keyPath, alias);
  }
  static allFrom(from) {
    const colName = from || PropertyExpression.kCBLAllPropertiesName;
    return new PropertyExpression(PropertyExpression.kCBLAllPropertiesName, from, colName);
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
  constructor(value) {
    super();
    this.value = value;
  }
  asJSON() {
    if (this.value instanceof Date) {
      return this.value.toISOString();
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
export let BinaryOpType = /*#__PURE__*/function (BinaryOpType) {
  BinaryOpType[BinaryOpType["Add"] = 0] = "Add";
  BinaryOpType[BinaryOpType["Between"] = 1] = "Between";
  BinaryOpType[BinaryOpType["Divide"] = 2] = "Divide";
  BinaryOpType[BinaryOpType["EqualTo"] = 3] = "EqualTo";
  BinaryOpType[BinaryOpType["GreaterThan"] = 4] = "GreaterThan";
  BinaryOpType[BinaryOpType["GreaterThanOrEqualTo"] = 5] = "GreaterThanOrEqualTo";
  BinaryOpType[BinaryOpType["In"] = 6] = "In";
  BinaryOpType[BinaryOpType["Is"] = 7] = "Is";
  BinaryOpType[BinaryOpType["IsNot"] = 8] = "IsNot";
  BinaryOpType[BinaryOpType["LessThan"] = 9] = "LessThan";
  BinaryOpType[BinaryOpType["LessThanOrEqualTo"] = 10] = "LessThanOrEqualTo";
  BinaryOpType[BinaryOpType["Like"] = 11] = "Like";
  BinaryOpType[BinaryOpType["Modulus"] = 12] = "Modulus";
  BinaryOpType[BinaryOpType["Multiply"] = 13] = "Multiply";
  BinaryOpType[BinaryOpType["NotEqualTo"] = 14] = "NotEqualTo";
  BinaryOpType[BinaryOpType["Subtract"] = 15] = "Subtract";
  BinaryOpType[BinaryOpType["RegexLike"] = 16] = "RegexLike";
  return BinaryOpType;
}({});
export class BinaryExpression extends Expression {
  static OpType = BinaryOpType;
  constructor(lhs, rhs, type) {
    super();
    this.lhs = lhs;
    this.rhs = rhs;
    this.type = type;
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
      const rangeExprs = this.rhs.getExpressions();
      json.push(rangeExprs[0].asJSON());
      json.push(rangeExprs[1].asJSON());
    } else {
      json.push(this.rhs.asJSON());
    }
    return json;
  }
}
export class AggregateExpression extends Expression {
  constructor(expressions) {
    super();
    this.expressions = expressions;
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
  constructor(name) {
    super();
    this.name = name;
  }
  asJSON() {
    return ['$' + this.name];
  }
}
export let CompoundExpressionOpType = /*#__PURE__*/function (CompoundExpressionOpType) {
  CompoundExpressionOpType[CompoundExpressionOpType["And"] = 0] = "And";
  CompoundExpressionOpType[CompoundExpressionOpType["Or"] = 1] = "Or";
  CompoundExpressionOpType[CompoundExpressionOpType["Not"] = 2] = "Not";
  return CompoundExpressionOpType;
}({});
export class CompoundExpression extends Expression {
  static OpType = CompoundExpressionOpType;
  constructor(subexpressions, type) {
    super();
    this.subexpressions = subexpressions;
    this.type = type;
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
    json.push(...this.subexpressions.map(s => s.asJSON()));
    return json;
  }
}
export let UnaryExpressionOpType = /*#__PURE__*/function (UnaryExpressionOpType) {
  UnaryExpressionOpType[UnaryExpressionOpType["Missing"] = 0] = "Missing";
  UnaryExpressionOpType[UnaryExpressionOpType["NotMissing"] = 1] = "NotMissing";
  UnaryExpressionOpType[UnaryExpressionOpType["NotNull"] = 2] = "NotNull";
  UnaryExpressionOpType[UnaryExpressionOpType["Null"] = 3] = "Null";
  return UnaryExpressionOpType;
}({});
export class UnaryExpression extends Expression {
  static OpType = UnaryExpressionOpType;
  constructor(operand, type) {
    super();
    this.operand = operand;
    this.type = type;
    if (operand == null) throw new Error('operand is null.');
  }
  asJSON() {
    const opd = this.operand.asJSON();
    switch (this.type) {
      case UnaryExpressionOpType.Missing:
        {
          return ['IS', opd, ['MISSING']];
        }
      case UnaryExpressionOpType.NotMissing:
        {
          return ['IS NOT', opd, ['MISSING']];
        }
      case UnaryExpressionOpType.Null:
        {
          return ['IS', opd, null];
        }
      case UnaryExpressionOpType.NotNull:
        {
          return ['IS NOT', opd, null];
        }
      default:
        return [];
    }
  }
}
export class CollationExpression extends Expression {
  constructor(operand, collation) {
    super();
    this.operand = operand;
    this.collation = collation;
  }
  asJSON() {
    return ['COLLATE', this.collation.asJSON(), this.operand.asJSON()];
  }
}
export class FunctionExpression extends Expression {
  constructor(func, params) {
    super();
    this.func = func;
    this.params = params;
  }
  asJSON() {
    const json = [this.func];
    json.push(...this.params.map(p => p.asJSON()));
    return json;
  }
}
//# sourceMappingURL=expression.mjs.map