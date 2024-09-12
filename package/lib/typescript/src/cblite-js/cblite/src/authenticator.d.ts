import { Dictionary } from './definitions';
export declare abstract class Authenticator {
    abstract authenticate(options: Dictionary): void;
    abstract getType(): string;
    abstract toJson(): any;
}
//# sourceMappingURL=authenticator.d.ts.map