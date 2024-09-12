"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionAuthenticator = void 0;
var _replicatorConfiguration = require("./replicator-configuration.cjs");
var _authenticator = require("./authenticator.cjs");
class SessionAuthenticator extends _authenticator.Authenticator {
  static DEFAULT_SYNC_GATEWAY_SESSION_ID_NAME = 'SyncGatewaySession';
  constructor(sessionID, cookieName = SessionAuthenticator.DEFAULT_SYNC_GATEWAY_SESSION_ID_NAME) {
    super();
    this.sessionID = sessionID;
    this.cookieName = cookieName;
  }
  authenticate(options) {
    const current = options[_replicatorConfiguration.ReplicatorConfiguration.CBLReplicatorOptionCookies] || '';
    let cookieStr = current;
    if (current.length) {
      cookieStr += '; ';
    }
    cookieStr += `${this.cookieName}=${this.sessionID}`;
    options[_replicatorConfiguration.ReplicatorConfiguration.CBLReplicatorOptionCookies] = cookieStr;
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
exports.SessionAuthenticator = SessionAuthenticator;
//# sourceMappingURL=session-authenticator.cjs.map