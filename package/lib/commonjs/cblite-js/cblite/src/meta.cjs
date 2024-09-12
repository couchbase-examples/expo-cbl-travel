"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Meta = void 0;
var _metaExpression = require("./meta-expression.cjs");
class Meta {
  static id = new _metaExpression.MetaExpression('_id', 'id', null);
  static sequence = new _metaExpression.MetaExpression('_sequence', 'sequence', null);
  static deleted = new _metaExpression.MetaExpression('_deleted', 'deleted', null);
  static expiration = new _metaExpression.MetaExpression('_expiration', 'expiration', null);
}
exports.Meta = Meta;
//# sourceMappingURL=meta.cjs.map