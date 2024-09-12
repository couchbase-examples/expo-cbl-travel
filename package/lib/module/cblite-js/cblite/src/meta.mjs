import { MetaExpression } from "./meta-expression.mjs";
export class Meta {
  static id = new MetaExpression('_id', 'id', null);
  static sequence = new MetaExpression('_sequence', 'sequence', null);
  static deleted = new MetaExpression('_deleted', 'deleted', null);
  static expiration = new MetaExpression('_expiration', 'expiration', null);
}
//# sourceMappingURL=meta.mjs.map