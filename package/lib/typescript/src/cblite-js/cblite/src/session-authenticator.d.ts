import { Dictionary } from './definitions';
import { Authenticator } from './authenticator';
export declare class SessionAuthenticator extends Authenticator {
    private sessionID;
    private cookieName;
    private static DEFAULT_SYNC_GATEWAY_SESSION_ID_NAME;
    constructor(sessionID: string, cookieName?: string);
    authenticate(options: Dictionary): void;
    getSessionID(): string;
    getCookieName(): string;
    getType(): string;
    toJson(): {
        cookieName: string;
        sessionID: string;
    };
}
//# sourceMappingURL=session-authenticator.d.ts.map