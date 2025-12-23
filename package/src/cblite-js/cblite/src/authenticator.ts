import { Dictionary } from './definitions';

export abstract class Authenticator {
  // eslint-disable-next-line
  abstract authenticate(options: Dictionary): void;
  abstract getType(): string;
  abstract toJson(): any;
}
