import { ReplicatorConfiguration } from "./replicator-configuration.mjs";
import { Authenticator } from "./authenticator.mjs";
export class SessionAuthenticator extends Authenticator {
  static DEFAULT_SYNC_GATEWAY_SESSION_ID_NAME = 'SyncGatewaySession';
  constructor(sessionID, cookieName = SessionAuthenticator.DEFAULT_SYNC_GATEWAY_SESSION_ID_NAME) {
    super();
    this.sessionID = sessionID;
    this.cookieName = cookieName;
  }
  authenticate(options) {
    const current = options[ReplicatorConfiguration.CBLReplicatorOptionCookies] || '';
    let cookieStr = current;
    if (current.length) {
      cookieStr += '; ';
    }
    cookieStr += `${this.cookieName}=${this.sessionID}`;
    options[ReplicatorConfiguration.CBLReplicatorOptionCookies] = cookieStr;
  }
  getSessionID() {
    return this.sessionID;
  }
  getCookieName() {
    return this.cookieName;
  }
  getType() {
    return 'session';
  }
  toJson() {
    return {
      cookieName: this.cookieName,
      sessionID: this.sessionID
    };
  }
}
//# sourceMappingURL=session-authenticator.mjs.map