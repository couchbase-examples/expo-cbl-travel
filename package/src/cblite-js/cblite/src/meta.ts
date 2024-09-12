import { MetaExpression } from './meta-expression';

export class Meta {
  static id: MetaExpression = new MetaExpression('_id', 'id', null);
  static sequence: MetaExpression = new MetaExpression(
    '_sequence',
    'sequence',
    null
  );
  static deleted: MetaExpression = new MetaExpression(
    '_deleted',
    'deleted',
    null
  );
  static expiration: MetaExpression = new MetaExpression(
    '_expiration',
    'expiration',
    null
  );
}
