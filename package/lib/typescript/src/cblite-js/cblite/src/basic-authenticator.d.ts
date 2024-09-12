import { Dictionary } from './definitions';
import { Authenticator } from './authenticator';
export declare class BasicAuthenticator extends Authenticator {
    private username;
    private password;
    constructor(username: string, password: string);
    authenticate(options: Dictionary): {
        [x: string]: string;
    };
    getType(): string;
    toJson(): {
        username: string;
        password: string;
    };
}
//# sourceMappingURL=basic-authenticator.d.ts.map