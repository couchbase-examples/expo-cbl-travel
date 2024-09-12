import { Dictionary } from './definitions';

export abstract class Authenticator {
  abstract authenticate(options: Dictionary): void;
  abstract getType(): string;
  abstract toJson(): any;
}
