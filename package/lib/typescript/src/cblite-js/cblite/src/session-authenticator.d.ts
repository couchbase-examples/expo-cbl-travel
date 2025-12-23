import { Dictionary } from './definitions';
import { Authenticator } from './authenticator';
export declare class SessionAuthenticator extends Authenticator {
    private sessionID;
    private cookieName;
    private static DEFAULT_SYNC_GATEWAY_SESSION_ID_NAME;
    constructor(sessionID: string, cookieName?: string);
    /**
     * Configures session-based authentication options for a replicator using cookies
     * @param {Dictionary} options - The options to be modified
     */
    authenticate(options: Dictionary): void;
    /**
   * Returns the session ID used for authentication
   * @returns {string} The current session ID
   */
    getSessionID(): string;
    /**
   * Returns the name of the cookie used for session authentication
   * @returns {string} The cookie name (defaults to 'SyncGatewaySession' if not specified)
   */
    getCookieName(): string;
    getType(): string;
    /**
    * Converts the session authenticator configuration to a JSON-compatible object
    * @returns {{ cookieName: string, sessionID: string }} An object containing the cookie name and session ID
    */
    toJson(): {
        cookieName: string;
        sessionID: string;
    };
}
//# sourceMappingURL=session-authenticator.d.ts.map