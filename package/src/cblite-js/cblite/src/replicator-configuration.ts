import { Authenticator } from './authenticator';
import { Collection } from './collection';
import { CollectionConfig } from './collection-config';
import { Endpoint } from './endpoint';

export enum ReplicatorType {
  PUSH_AND_PULL = 'PUSH_AND_PULL',
  PUSH = 'PUSH',
  PULL = 'PULL',
}

export class ReplicatorConfiguration {
  static readonly ReplicatorType = ReplicatorType;

  // Authentication dictionary keys:
  static CBLReplicatorOptionCookies = 'cookies'; // HTTP Cookie header value; string
  static CBLReplicatorAuthOption = 'auth'; // Auth settings; Dict
  static CBLReplicatorAuthType = 'type'; // Auth property; string
  static CBLReplicatorAuthUserName = 'username'; // Auth property; string
  static CBLReplicatorAuthPassword = 'password'; // Auth property; string
  static CBLReplicatorAuthClientCert = 'clientCert'; // Auth property; value platform-dependent

  // auth.type values:
  static CBLAuthTypeBasic = 'Basic'; // HTTP Basic (the default)
  static CBLAuthTypeSession = 'Session'; // SG session cookie
  static CBLAuthTypeOpenIDConnect = 'OpenID Connect';
  static CBLAuthTypeClientCert = 'Client Cert';

  private continuous: boolean;
  private replicatorType: ReplicatorType;
  private authenticator: Authenticator;
  private pinnedServerCertificate: string;
  private headers: { [name: string]: string };
  private heartbeat: number;
  private maxAttempts: number;
  private maxAttemptWaitTime: number;
  private allowReplicatingInBackground: boolean;
  private acceptOnlySelfSignedCerts: boolean;
  private autoPurgeEnabled: boolean;
  private acceptParentDomainCookies: boolean;
  private readonly collections: Map<Collection[], CollectionConfig>;

  public static defaultContinuous: boolean = false;
  public static defaultEnableAutoPurge: boolean = true;
  public static defaultSelfSignedCertificateOnly: boolean = true;
  public static defaultAcceptParentDomainCookies: boolean = false;
  public static defaultAllowReplicatingInBackground: boolean = false;
  public static defaultHeartbeat: number = 300;
  public static defaultMaxAttemptsSingleShot: number = 10;
  public static defaultMaxAttemptsWaitTime: number = 300;

  constructor(private target: Endpoint) {
    this.replicatorType = ReplicatorType.PUSH_AND_PULL;
    this.target = target;
    this.collections = new Map();

    this.continuous = ReplicatorConfiguration.defaultContinuous;
    this.autoPurgeEnabled = ReplicatorConfiguration.defaultEnableAutoPurge;
    this.heartbeat = ReplicatorConfiguration.defaultHeartbeat;
    this.acceptOnlySelfSignedCerts =
      ReplicatorConfiguration.defaultSelfSignedCertificateOnly;
    this.acceptParentDomainCookies =
      ReplicatorConfiguration.defaultAcceptParentDomainCookies;
    this.allowReplicatingInBackground =
      ReplicatorConfiguration.defaultAllowReplicatingInBackground;
    this.maxAttempts = ReplicatorConfiguration.defaultMaxAttemptsSingleShot;
    this.maxAttemptWaitTime =
      ReplicatorConfiguration.defaultMaxAttemptsWaitTime;
    this.authenticator = undefined;
    this.headers = undefined;
    this.pinnedServerCertificate = undefined;
  }

  /**
   * Add a collection used for the replication with an optional collection configuration. If the collection has
   * been added before, the previous added and its configuration if specified will be replaced. If the config is omitted or a null or undefined configuration is specified, a default empty configuration will be applied.
   *
   * @function
   */
  addCollection(collection: Collection): void;
  // eslint-disable-next-line no-dupe-class-members
  addCollection(collection: Collection, config?: CollectionConfig): void {
    const cols: Collection[] = [];
    cols.push(collection);

    this.removeCollection(collection);
    if (config === undefined || config === null) {
      config = new CollectionConfig(undefined, undefined);
    }
    this.collections.set(cols, config);
  }

  /**
   * Add multiple collections used for the replication with an optional shared collection configuration.
   * If any of the collections have been added before, the previously added collections and their
   * configuration if specified will be replaced. Adding an empty collection array will be no-ops. if
   * specified will be replaced. If a null or undefined configuration is specified, a default empty configuration will be
   * applied.
   *
   * @function
   */
  addCollections(
    collections: Collection[],
    config?: CollectionConfig | null | undefined
  ) {
    this.removeCollections(collections);
    if (config === undefined || config === null) {
      config = new CollectionConfig(undefined, undefined);
    }
    this.collections.set(collections, config);
  }

  /**
   *  returns the setting used to specify the replicator to accept any and only self-signed certs. Any non-self-signed
   *  certs will be rejected to avoid accidentally using this mode with the non-self-signed certs in production.
   *
   * @function
   */
  getAcceptOnlySelfSignedCerts(): boolean {
    return this.acceptOnlySelfSignedCerts;
  }

  /**
   *  returns the setting  used as the option to remove the restriction that does not allow the replicator to save the
   *  parent-domain cookies, the cookies whose domains are the parent domain of the remote host, from the HTTP
   *  response. For example, when the option is set to true, the cookies whose domain are “.foo.com”
   *  returned by “bar.foo.com” host will be permitted to save.
   *
   *  This option is disabled by default which means that the parent-domain cookies are not permitted to save by default.
   *
   * @function
   */
  getAcceptParentDomainCookies(): boolean {
    return this.acceptParentDomainCookies;
  }

  /**
   * returns the setting which is used to allow the replicator to continue replicating in the background.
   * The default value is false, which means that the replicator will suspend itself when the
   * replicator detects that the application is running in the background.
   *
   * If setting the value to true, the developer MUST ensure that the application requests
   * for extending the background task properly in the configuration.  See your platforms documentation
   * more information.
   *
   * @function
   */
  getAllowReplicatingInBackground(): boolean {
    return this.allowReplicatingInBackground;
  }

  /**
   * return the auto purge feature setting
   *
   * The default value is true which means that the document will be automatically purged by the
   * pull replicator when the user loses access to the document from both removed and revoked scenarios.
   *
   * When the property is set to false, this behavior is disabled and access removed event
   * will be sent to any document listeners that are active on the replicator. For performance
   * reasons, the document listeners must be added **before** the replicator is started, or
   * they will not receive the events.
   *
   * Note: Auto purge will not be performed when documentIDs filter is specified.
   *
   * @function
   */
  getAutoPurgeEnabled(): boolean {
    return this.autoPurgeEnabled;
  }

  /**
   * returns the Authenticator to authenticate with a remote target.
   *
   * @function
   */
  getAuthenticator(): Authenticator {
    return this.authenticator;
  }

  /**
   * returns collections used for the replication.
   *
   * @function
   */
  getCollections() {
    const keys = this.collections.keys();
    return Array.from(keys).flat();
  }

  /**
   * returns a copy of the collection’s config. If the config needs to be changed for the collection, the
   * collection will need to be re-added with the updated config.
   *
   * @function
   */
  getCollectionConfig(collection: Collection): CollectionConfig | null {
    for (const key of this.collections.keys()) {
      if (key.includes(collection)) {
        return this.collections.get(key);
      }
    }
    return null;
  }

  /**
   * returns the continuous flag indicating whether the replicator should stay
   * active indefinitely to replicate changed documents.
   *
   * @function
   */
  getContinuous(): boolean {
    return this.continuous;
  }

  /**
   * returns extra HTTP headers to send in all requests to the remote target.
   *
   * @function
   */
  getHeaders(): { [name: string]: string } {
    return this.headers;
  }

  /**
   * returns the heartbeat interval in second.
   *
   * The interval when the replicator sends the ping message to check whether the other peer is
   * still alive. Default heartbeat is ``ReplicatorConfiguration.defaultHeartbeat`` secs.
   *
   * Note: Setting the heartbeat to negative value will result in an Exception
   * being thrown. For backward compatibility, setting it to zero will result in
   * default 300 secs internally.
   *
   * @function
   */
  getHeartbeat(): number {
    return this.heartbeat;
  }

  /**
   * returns the maximum attempts to perform retry. The retry attempt will be reset when the replicator is
   * able to connect and replicate with the remote server again.
   *
   * Default _maxAttempts_ is ``ReplicatorConfiguration.defaultMaxAttemptsSingleShot`` times
   * for single shot replicators and ``ReplicatorConfiguration.defaultMaxAttemptsContinuous`` times
   * for continuous replicators.
   *
   * Settings the value to 1, will perform an initial request and if there is a transient error
   * occurs, will stop without retry.
   *
   * Note: For backward compatibility, setting it to zero will result in default 10 internally.
   *
   * @function
   */
  getMaxAttempts(): number {
    return this.maxAttempts;
  }

  /**
   * returns the max wait time for the next attempt(retry) in seconds.
   *
   * The exponential backoff for calculating the wait time will be used by default and cannot be
   * customized. Default max attempts is `ReplicatorConfiguration.defaultMaxAttemptsWaitTime` secs.
   *
   * Set the maxAttemptWaitTime to negative value will result in an Exception
   * being thrown.
   *
   * Note: For backward compatibility, setting it to zero will result in default secs internally.
   *
   * @function
   */
  getMaxAttemptWaitTime(): number {
    return this.maxAttemptWaitTime;
  }

  /**
   *  returns the string value of the remote target's SSL certificate that was previously set in the configuration.
   *
   *  Note: The pinned cert will be evaluated against any certs in a cert chain,
   *  and the cert chain will be valid only if the cert chain contains the pinned cert.
   *
   * @function
   */
  getPinnedServerCertificate(): string {
    return this.pinnedServerCertificate;
  }

  /**
   * returns the replicator type indicating the direction of the replicator.
   *
   * @function
   */
  getReplicatorType(): ReplicatorType {
    return this.replicatorType;
  }

  /**
   * Remove a group of collections from the configuration. If the collection doesn’t exist, this operation will be no ops.
   *
   * @function
   */
  removeCollections(collections: Collection[]) {
    for (const col of collections) {
      for (const key of this.collections.keys()) {
        if (key.includes(col)) {
          this.collections.delete(key);
        }
      }
    }
  }

  /**
   * Remove the collection. If the collection doesn’t exist, this operation will be no ops.
   *
   * @function
   */
  removeCollection(collection: Collection) {
    for (const key of this.collections.keys()) {
      if (key.includes(collection)) {
        const newCols = key.filter((col) => col !== collection);
        const config = this.collections.get(key);
        this.collections.delete(key);
        this.collections.set(newCols, config);
      }
    }
  }

  /**
   *  Specify the replicator to accept any and only self-signed certs. Any non-self-signed certs will be rejected
   *  to avoid accidentally using this mode with the non-self-signed certs in production.
   *  Default value is ``ReplicatorConfiguration.defaultSelfSignedCertificateOnly``
   *
   * @function
   */
  setAcceptOnlySelfSignedCerts(selfSignedCerts: boolean) {
    this.acceptOnlySelfSignedCerts = selfSignedCerts;
  }

  /**
   *  The option to remove the restriction that does not allow the replicator to save the parent-domain
   *  cookies, the cookies whose domains are the parent domain of the remote host, from the HTTP
   *  response. For example, when the option is set to true, the cookies whose domain are “.foo.com”
   *  returned by “bar.foo.com” host will be permitted to save.
   *
   *  This option is disabled by default (See ``ReplicatorConfiguration.defaultAcceptParentCookies``)
   *  which means that the parent-domain cookies are not permitted to save by default.
   *
   * @function
   */
  setAcceptParentDomainCookies(acceptParentDomainCookies: boolean) {
    this.acceptParentDomainCookies = acceptParentDomainCookies;
  }

  /**
   * Allows the replicator to continue replicating in the background. The default
   * value is false, which means that the replicator will suspend itself when the
   * replicator detects that the application is running in the background.
   *
   * If setting the value to true, the developer MUST ensure that the application requests
   * for extending the background task properly in the configuration.  See your platforms documentation
   * more information.
   *
   * @function
   */
  setAllowReplicatingInBackground(allowReplicatingInBackground: boolean) {
    this.allowReplicatingInBackground = allowReplicatingInBackground;
  }

  /**
   * To enable/disable the auto purge feature
   *
   * The default value is true which means that the document will be automatically purged by the
   * pull replicator when the user loses access to the document from both removed and revoked scenarios.
   *
   * When the property is set to false, this behavior is disabled and access removed event
   * will be sent to any document listeners that are active on the replicator. For performance
   * reasons, the document listeners must be added **before** the replicator is started, or
   * they will not receive the events.
   *
   * Note: Auto purge will not be performed when documentIDs filter is specified.
   *
   * @function
   */
  setAutoPurgeEnabled(autoPurgeEnabled: boolean) {
    this.autoPurgeEnabled = autoPurgeEnabled;
  }

  /**
   * The Authenticator to authenticate with a remote target.
   *
   * @function
   */
  setAuthenticator(authenticator: Authenticator) {
    this.authenticator = authenticator;
  }

  /**
   * The continuous flag indicating whether the replicator should stay
   * active indefinitely to replicate changed documents.
   *
   * @function
   */
  setContinuous(continuous: boolean) {
    this.continuous = continuous;
  }

  /**
   * Extra HTTP headers to send in all requests to the remote target.
   *
   * @function
   */
  setHeaders(headers: { [name: string]: string }) {
    this.headers = headers;
  }

  /**
   * The heartbeat interval in second.
   *
   * The interval when the replicator sends the ping message to check whether the other peer is
   * still alive. Default heartbeat is ``ReplicatorConfiguration.defaultHeartbeat`` secs.
   *
   * Note: Setting the heartbeat to negative value will result in an Exception
   * being thrown. For backward compatibility, setting it to zero will result in
   * default 300 secs internally.
   *
   * @function
   */
  setHeartbeat(heartbeat: number) {
    this.heartbeat = heartbeat;
  }

  /**
   * The maximum attempts to perform retry. The retry attempt will be reset when the replicator is
   * able to connect and replicate with the remote server again.
   *
   * Default _maxAttempts_ is ``ReplicatorConfiguration.defaultMaxAttemptsSingleShot`` times
   * for single shot replicators and ``ReplicatorConfiguration.defaultMaxAttemptsContinuous`` times
   * for continuous replicators.
   *
   * Settings the value to 1, will perform an initial request and if there is a transient error
   * occurs, will stop without retry.
   *
   * Note: For backward compatibility, setting it to zero will result in default 10 internally.
   *
   * @function
   */
  setMaxAttempts(maxAttempts: number) {
    this.maxAttempts = maxAttempts;
  }

  /**
   * Max wait time for the next attempt(retry) in seconds.
   *
   * The exponential backoff for calculating the wait time will be used by default and cannot be
   * customized. Default max attempts is `ReplicatorConfiguration.defaultMaxAttemptsWaitTime` secs.
   *
   * Set the maxAttemptWaitTime to negative value will result in an Exception
   * being thrown.
   *
   * Note: For backward compatibility, setting it to zero will result in default secs internally.
   *
   * @function
   */
  setMaxAttemptWaitTime(maxAttemptWaitTime: number) {
    if (maxAttemptWaitTime >= 0) {
      this.maxAttemptWaitTime = maxAttemptWaitTime;
    } else {
      throw new Error('Error:  maxAttemptWaitTime cannot be negative.');
    }
  }

  /**
   *  The remote target's SSL certificate.
   *
   *  Note: The pinned cert will be evaluated against any certs in a cert chain,
   *  and the cert chain will be valid only if the cert chain contains the pinned cert.
   *
   * @function
   */
  setPinnedServerCertificate(pinnedServerCertificate: string) {
    this.pinnedServerCertificate = pinnedServerCertificate;
  }

  /**
   * Replicator type indicating the direction of the replicator.
   *
   * @function
   */
  setReplicatorType(replicatorType: ReplicatorType) {
    this.replicatorType = replicatorType;
  }

  toJson(): any {
    let config = {
      acceptParentDomainCookies: this.acceptParentDomainCookies,
      acceptSelfSignedCerts: this.acceptOnlySelfSignedCerts,
      allowReplicationInBackground: this.allowReplicatingInBackground,
      autoPurgeEnabled: this.autoPurgeEnabled,
      authenticator: null,
      collectionConfig: null,
      continuous: this.continuous,
      headers: null,
      heartbeat: this.heartbeat,
      maxAttempts: this.maxAttempts,
      maxAttemptWaitTime: this.maxAttemptWaitTime,
      pinnedServerCertificate: null,
      replicatorType: this.replicatorType,
      target: this.target.toJson(),
    };

    if (this.headers !== undefined) {
      config.headers = this.headers;
    } else {
      config.headers = '';
    }
    if (this.pinnedServerCertificate !== undefined) {
      config.pinnedServerCertificate = this.pinnedServerCertificate;
    } else {
      config.pinnedServerCertificate = '';
    }
    if (this.authenticator !== undefined) {
      config.authenticator = {
        type: this.authenticator.getType(),
        data: this.authenticator.toJson(),
      };
    } else {
      config.authenticator = '';
    }
    if (this.collections.size > 0) {
      if (this.checkCollectionsScopeAndDatabase()) {
        const colArray = [];
        for (let [collections, collectionConfig] of this.collections) {
          const collectionsArray = [];
          for (let collection of collections) {
            collectionsArray.push({ collection: collection.toJson() });
          }
          if (collectionConfig !== undefined || collectionConfig !== null) {
            colArray.push({
              collections: collectionsArray,
              config: collectionConfig,
            });
          } else {
            colArray.push({ collections: collectionsArray, config: '' });
          }
        }
        config.collectionConfig = JSON.stringify(colArray);
      } else {
        throw new Error(
          'All collections must be from the same database and scope'
        );
      }
    } else {
      config.collectionConfig = '';
    }
    return config;
  }

  private checkCollectionsScopeAndDatabase(): boolean {
    let databaseName: string = null;
    let scopeName: string = null;

    for (let [collections, _] of this.collections) {
      for (let collection of collections) {
        if (databaseName === null && scopeName === null) {
          databaseName = collection.database.getName();
          scopeName = collection.scope.name;
        } else if (
          collection.database.getName() !== databaseName ||
          collection.scope.name !== scopeName
        ) {
          return false;
        }
      }
    }

    return true;
  }
}
