"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicAuthenticator = void 0;
var _replicatorConfiguration = require("./replicator-configuration.cjs");
var _authenticator = require("./authenticator.cjs");
class BasicAuthenticator extends _authenticator.Authenticator {
  constructor(username, password) {
    super();
    this.username = username;
    this.password = password;
  }
  authenticate(options) {
    const auth = {
      [_replicatorConfiguration.ReplicatorConfiguration.CBLReplicatorAuthType]: _replicatorConfiguration.ReplicatorConfiguration.CBLAuthTypeBasic,
      [_replicatorConfiguration.ReplicatorConfiguration.CBLReplicatorAuthUserName]: this.username,
      [_replicatorConfiguration.ReplicatorConfiguration.CBLReplicatorAuthPassword]: this.password
    };
    options[_replicatorConfiguration.ReplicatorConfiguration.CBLReplicatorAuthOption] = auth;
    return auth;
  }
  getType() {
    return 'basic';
  }
  toJson() {
    return {
      username: this.username,
      password: this.password
    };
  }
}
exports.BasicAuthenticator = BasicAuthenticator;
//# sourceMappingURL=basic-authenticator.cjs.map