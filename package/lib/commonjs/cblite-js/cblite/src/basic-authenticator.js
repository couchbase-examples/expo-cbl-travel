"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicAuthenticator = void 0;
var _replicatorConfiguration = require("./replicator-configuration.js");
var _authenticator = require("./authenticator.js");
class BasicAuthenticator extends _authenticator.Authenticator {
  constructor(
  // eslint-disable-next-line
  username,
  // eslint-disable-next-line
  password) {
    super();
    this.username = username;
    this.password = password;
  }

  /**
  * Configures basic authentication options for a replicator
  * @param {Dictionary} options - The replicator configuration options to be modified
  * @returns {Dictionary} The authentication configuration containing username and password
  * @example
  * const authenticator = new BasicAuthenticator('user', 'password');
  * const config = {};
  * const auth = authenticator.authenticate(config);
  * // config now contains the auth settings
  * // auth contains: { type: 'basic', username: 'user', password: 'password' }
  */
  authenticate(options) {
    const auth = {
      [_replicatorConfiguration.ReplicatorConfiguration.CBLReplicatorAuthType]: _replicatorConfiguration.ReplicatorConfiguration.CBLAuthTypeBasic,
      [_replicatorConfiguration.ReplicatorConfiguration.CBLReplicatorAuthUserName]: this.username,
      [_replicatorConfiguration.ReplicatorConfiguration.CBLReplicatorAuthPassword]: this.password
    };
    options[_replicatorConfiguration.ReplicatorConfiguration.CBLReplicatorAuthOption] = auth;
    return auth;
  }

  /**
  * Returns the authentication type identifier
  * @returns {string} The string 'basic' indicating basic authentication
  * @example
  * const authenticator = new BasicAuthenticator('user', 'password');
  * const type = authenticator.getType();
  * // Returns: 'basic'
  */
  getType() {
    return 'basic';
  }

  /**
  * Converts the authenticator to a JSON-compatible object
  * @returns {{ username: string, password: string }} An object containing the authenticator's credentials
  * @example
  * const authenticator = new BasicAuthenticator('user', 'password');
  * const json = authenticator.toJson();
  * // Returns: { username: 'user', password: 'password' }
  */
  toJson() {
    return {
      username: this.username,
      password: this.password
    };
  }
}
exports.BasicAuthenticator = BasicAuthenticator;
//# sourceMappingURL=basic-authenticator.js.map