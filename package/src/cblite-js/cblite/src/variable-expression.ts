import { Expression } from './expression';

export class VariableExpression extends Expression {

  // eslint-disable-next-line
  constructor(private name: string) {
    super();
  }

  getName() {
    return this.name;
  }

  public asJSON(): any[] {
    return ['?' + this.name];
  }
}
