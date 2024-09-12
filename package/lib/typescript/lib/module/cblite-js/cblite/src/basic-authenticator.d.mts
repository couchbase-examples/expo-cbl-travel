export class BasicAuthenticator extends Authenticator {
    constructor(username: any, password: any);
    username: any;
    password: any;
    authenticate(options: any): {
        [x: string]: any;
    };
    getType(): string;
    toJson(): {
        username: any;
        password: any;
    };
}
import { Authenticator } from "./authenticator.mjs";
//# sourceMappingURL=basic-authenticator.d.mts.map