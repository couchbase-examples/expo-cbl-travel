import { Dictionary } from './definitions';
import { ReplicatorConfiguration } from './replicator-configuration';
import { Authenticator } from './authenticator';

export class BasicAuthenticator extends Authenticator {
  constructor(
    private username: string,
    private password: string
  ) {
    super();
  }

  authenticate(options: Dictionary) {
    const auth = {
      [ReplicatorConfiguration.CBLReplicatorAuthType]:
        ReplicatorConfiguration.CBLAuthTypeBasic,
      [ReplicatorConfiguration.CBLReplicatorAuthUserName]: this.username,
      [ReplicatorConfiguration.CBLReplicatorAuthPassword]: this.password,
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
      password: this.password,
    };
  }
}
