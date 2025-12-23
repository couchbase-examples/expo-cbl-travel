"use strict";

import { ReplicatorConfiguration } from "./replicator-configuration.js";
import { Authenticator } from "./authenticator.js";
export class SessionAuthenticator extends Authenticator {
  static DEFAULT_SYNC_GATEWAY_SESSION_ID_NAME = 'SyncGatewaySession';

  // eslint-disable-next-line
  constructor(sessionID, cookieName = SessionAuthenticator.DEFAULT_SYNC_GATEWAY_SESSION_ID_NAME) {
    super();
    this.sessionID = sessionID;
    this.cookieName = cookieName;
  }

  /**
   * Configures session-based authentication options for a replicator using cookies
   * @param {Dictionary} options - The options to be modified
   */
  authenticate(options) {
    const current = options[ReplicatorConfiguration.CBLReplicatorOptionCookies] || '';
    let cookieStr = current;
    if (current.length) {
      cookieStr += '; ';
    }
    cookieStr += `${this.cookieName}=${this.sessionID}`;
    options[ReplicatorConfiguration.CBLReplicatorOptionCookies] = cookieStr;
  }

  /**
  * Returns the session ID used for authentication
  * @returns {string} The current session ID
  */
  getSessionID() {
    return this.sessionID;
  }

  /**
  * Returns the name of the cookie used for session authentication
  * @returns {string} The cookie name (defaults to 'SyncGatewaySession' if not specified)
  */
  getCookieName() {
    return this.cookieName;
  }
  getType() {
    return 'session';
  }

  /**
  * Converts the session authenticator configuration to a JSON-compatible object
  * @returns {{ cookieName: string, sessionID: string }} An object containing the cookie name and session ID
  */
  toJson() {
    return {
      cookieName: this.cookieName,
      sessionID: this.sessionID
    };
  }
}
//# sourceMappingURL=session-authenticator.js.map