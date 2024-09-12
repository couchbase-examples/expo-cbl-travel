export class SessionAuthenticator extends Authenticator {
    static DEFAULT_SYNC_GATEWAY_SESSION_ID_NAME: string;
    constructor(sessionID: any, cookieName?: string);
    sessionID: any;
    cookieName: string;
    authenticate(options: any): void;
    getSessionID(): any;
    getCookieName(): string;
    getType(): string;
    toJson(): {
        cookieName: string;
        sessionID: any;
    };
}
import { Authenticator } from "./authenticator.mjs";
//# sourceMappingURL=session-authenticator.d.mts.map