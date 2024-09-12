export const __esModule: boolean;
export class SessionAuthenticator extends _authenticator.Authenticator {
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
import _authenticator = require("./authenticator.cjs");
//# sourceMappingURL=session-authenticator.d.cts.map