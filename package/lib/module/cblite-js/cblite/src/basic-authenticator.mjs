import { ReplicatorConfiguration } from "./replicator-configuration.mjs";
import { Authenticator } from "./authenticator.mjs";
export class BasicAuthenticator extends Authenticator {
  constructor(username, password) {
    super();
    this.username = username;
    this.password = password;
  }
  authenticate(options) {
    const auth = {
      [ReplicatorConfiguration.CBLReplicatorAuthType]: ReplicatorConfiguration.CBLAuthTypeBasic,
      [ReplicatorConfiguration.CBLReplicatorAuthUserName]: this.username,
      [ReplicatorConfiguration.CBLReplicatorAuthPassword]: this.password
    };
    options[ReplicatorConfiguration.CBLReplicatorAuthOption] = auth;
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
//# sourceMappingURL=basic-authenticator.mjs.map