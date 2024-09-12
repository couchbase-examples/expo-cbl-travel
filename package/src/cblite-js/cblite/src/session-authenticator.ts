import { Dictionary } from './definitions';
import { ReplicatorConfiguration } from './replicator-configuration';
import { Authenticator } from './authenticator';

export class SessionAuthenticator extends Authenticator {
  private static DEFAULT_SYNC_GATEWAY_SESSION_ID_NAME = 'SyncGatewaySession';

  constructor(
    private sessionID: string,
    private cookieName: string = SessionAuthenticator.DEFAULT_SYNC_GATEWAY_SESSION_ID_NAME
  ) {
    super();
  }

  authenticate(options: Dictionary) {
    const current =
      options[ReplicatorConfiguration.CBLReplicatorOptionCookies] || '';
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
      sessionID: this.sessionID,
    };
  }
}
