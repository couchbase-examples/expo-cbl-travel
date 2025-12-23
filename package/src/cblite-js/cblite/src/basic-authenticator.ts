import { Dictionary } from './definitions';
import { ReplicatorConfiguration } from './replicator-configuration';
import { Authenticator } from './authenticator';

export class BasicAuthenticator extends Authenticator {
  constructor(
    // eslint-disable-next-line
    private username: string,
    // eslint-disable-next-line
    private password: string
  ) {
    super();
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
      password: this.password,
    };
  }
}
