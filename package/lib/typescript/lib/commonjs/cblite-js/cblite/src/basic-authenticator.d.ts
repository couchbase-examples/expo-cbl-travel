export const __esModule: boolean;
export class BasicAuthenticator extends _authenticator.Authenticator {
    constructor(username: any, password: any);
    username: any;
    password: any;
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
    authenticate(options: Dictionary): Dictionary;
    /**
    * Returns the authentication type identifier
    * @returns {string} The string 'basic' indicating basic authentication
    * @example
    * const authenticator = new BasicAuthenticator('user', 'password');
    * const type = authenticator.getType();
    * // Returns: 'basic'
    */
    getType(): string;
    /**
    * Converts the authenticator to a JSON-compatible object
    * @returns {{ username: string, password: string }} An object containing the authenticator's credentials
    * @example
    * const authenticator = new BasicAuthenticator('user', 'password');
    * const json = authenticator.toJson();
    * // Returns: { username: 'user', password: 'password' }
    */
    toJson(): {
        username: string;
        password: string;
    };
}
import _authenticator = require("./authenticator.js");
//# sourceMappingURL=basic-authenticator.d.ts.map