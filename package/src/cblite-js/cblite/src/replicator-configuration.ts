import { Authenticator } from './authenticator';
import { Collection } from './collection';
import { CollectionConfiguration, ReplicationFilter } from './collection-configuration';
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
  private readonly collectionConfigurations: CollectionConfiguration[];
  private target: Endpoint; // Made mutable for dual API support
  
  // OLD API support
  private collectionsMap: Map<Collection[], CollectionConfig | undefined> = new Map();
  private isNewApi: boolean = false;

  public static defaultContinuous: boolean = false;
  public static defaultEnableAutoPurge: boolean = true;
  public static defaultSelfSignedCertificateOnly: boolean = true;
  public static defaultAcceptParentDomainCookies: boolean = false;
  public static defaultAllowReplicatingInBackground: boolean = false;
  public static defaultHeartbeat: number = 300;
  public static defaultMaxAttemptsSingleShot: number = 10;
  public static defaultMaxAttemptsWaitTime: number = 300;

  /**
   * Creates a new ReplicatorConfiguration.
   * 
   * **DUAL API SUPPORT:**
   * 
   * **NEW API (Recommended):**
   * Pass collectionConfigurations array and endpoint at construction.
   * Collections and endpoint are required, no mutation after construction.
   * 
   * **OLD API (Deprecated but still supported):**
   * Pass only endpoint at construction, then use add/removeCollections() methods.
   * 
   * @param targetOrCollectionConfigs - Either CollectionConfiguration[] (NEW API) or Endpoint (OLD API)
   * @param target - The endpoint (required for NEW API, omitted for OLD API)
   * 
   * @throws Error if NEW API is used with empty array
   * 
   * @example NEW API (Recommended):
   * ```typescript
   * const usersConfig = new CollectionConfiguration(usersCollection)
   *   .setChannels(['public']);
   * const config = new ReplicatorConfiguration(
   *   [usersConfig],
   *   new URLEndpoint('ws://localhost:4984/mydb')
   * );
   * ```
   * 
   * @example OLD API (Deprecated):
   * ```typescript
   * const config = new ReplicatorConfiguration(
   *   new URLEndpoint('ws://localhost:4984/mydb')
   * );
   * const collConfig = new CollectionConfig();
   * collConfig.setChannels(['public']);
   * config.addCollections([usersCollection], collConfig);
   * ```
   */
  constructor(
    targetOrCollectionConfigs: CollectionConfiguration[] | Endpoint,
    target?: Endpoint
  ) {
    // Detect which API is being used
    if (Array.isArray(targetOrCollectionConfigs)) {
      // NEW API: constructor(collectionConfigurations: CollectionConfiguration[], target: Endpoint)
      if (!targetOrCollectionConfigs || targetOrCollectionConfigs.length === 0) {
        throw new Error('At least one collection configuration is required');
      }
      if (!target) {
        throw new Error('Target endpoint is required');
      }

      this.isNewApi = true;
      this.collectionConfigurations = targetOrCollectionConfigs;
      this.target = target;
    } else {
      // OLD API: constructor(target: Endpoint)
      this.isNewApi = false;
      this.collectionConfigurations = []; // Empty for OLD API
      this.target = targetOrCollectionConfigs as Endpoint;
    }

    // Set default values (common to both APIs)
    this.replicatorType = ReplicatorType.PUSH_AND_PULL;
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
   * Gets the collection configurations for this replicator.
   * 
   * @returns Array of CollectionConfiguration objects
   * 
   * @example
   * ```typescript
   * const configs = replConfig.getCollectionConfigurations();
   * for (const config of configs) {
   *   console.log(`Collection: ${config.getCollection().name}`);
   *   console.log(`Channels: ${config.getChannels()}`);
   * }
   * ```
   */
  getCollectionConfigurations(): CollectionConfiguration[] {
    return this.collectionConfigurations;
  }

  /**
   * Gets all collections configured for replication.
   * 
   * **Dual API Support:**
   * - NEW API: Returns collections from CollectionConfiguration array
   * - OLD API: Returns collections from collectionsMap
   * 
   * @returns Array of Collection objects
   * 
   * @example
   * ```typescript
   * const collections = replConfig.getCollections();
   * console.log(`Replicating ${collections.length} collections`);
   * ```
   */
  getCollections(): Collection[] {
    if (this.isNewApi) {
      // NEW API: Get from collectionConfigurations
      return this.collectionConfigurations.map(config => config.getCollection());
    } else {
      // OLD API: Get from collectionsMap
      const collections: Collection[] = [];
      for (const [collectionArray, _] of this.collectionsMap.entries()) {
        collections.push(...collectionArray);
      }
      return collections;
    }
  }

  /**
   * Gets the replication endpoint/target.
   * 
   * @returns The Endpoint object
   */
  getTarget(): Endpoint {
    return this.target;
  }

  /**
   * **[OLD API]** Adds a collection to replicate with the given configuration.
   * 
   * @param collection - The collection to add
   * @param config - The replication configuration for this collection
   * 
   * @deprecated Use NEW API constructor with CollectionConfiguration[] instead
   * 
   * @throws Error if called on a NEW API instance
   * 
   * @example
   * ```typescript
   * const config = new ReplicatorConfiguration(endpoint);
   * const collConfig = new CollectionConfig();
   * collConfig.setChannels(['public']);
   * config.addCollection(usersCollection, collConfig);
   * ```
   */
  addCollection(collection: Collection, config: CollectionConfig): void {
    if (this.isNewApi) {
      throw new Error('Cannot call addCollection() on NEW API instance. Collections must be provided at construction.');
    }
    this.collectionsMap.set([collection], config);
  }

  /**
   * **[OLD API]** Adds multiple collections to replicate with the same configuration.
   * 
   * @param collections - Array of collections to add
   * @param config - The shared replication configuration
   * 
   * @deprecated Use NEW API constructor with CollectionConfiguration[] instead
   * 
   * @throws Error if called on a NEW API instance
   * 
   * @example
   * ```typescript
   * const config = new ReplicatorConfiguration(endpoint);
   * const collConfig = new CollectionConfig();
   * collConfig.setChannels(['public']);
   * config.addCollections([users, orders], collConfig);
   * ```
   */
  addCollections(collections: Collection[], config: CollectionConfig): void {
    if (this.isNewApi) {
      throw new Error('Cannot call addCollections() on NEW API instance. Collections must be provided at construction.');
    }
    this.collectionsMap.set(collections, config);
  }

  /**
   * **[OLD API]** Removes a collection from replication.
   * 
   * @param collection - The collection to remove
   * 
   * @deprecated Use NEW API constructor with CollectionConfiguration[] instead
   * 
   * @throws Error if called on a NEW API instance
   */
  removeCollection(collection: Collection): void {
    if (this.isNewApi) {
      throw new Error('Cannot call removeCollection() on NEW API instance. Collections are immutable.');
    }
    for (const [collections, config] of this.collectionsMap.entries()) {
      if (collections.includes(collection)) {
        const filtered = collections.filter(c => c !== collection);
        this.collectionsMap.delete(collections);
        if (filtered.length > 0) {
          this.collectionsMap.set(filtered, config);
        }
        return;
      }
    }
  }

  /**
   * **[OLD API]** Removes multiple collections from replication.
   * 
   * @param collections - Array of collections to remove
   * 
   * @deprecated Use NEW API constructor with CollectionConfiguration[] instead
   * 
   * @throws Error if called on a NEW API instance
   */
  removeCollections(collections: Collection[]): void {
    if (this.isNewApi) {
      throw new Error('Cannot call removeCollections() on NEW API instance. Collections are immutable.');
    }
    for (const collection of collections) {
      this.removeCollection(collection);
    }
  }

  /**
   * **[OLD API]** Gets the configuration for a specific collection.
   * 
   * @param collection - The collection to get config for
   * @returns The CollectionConfig or undefined if not found
   * 
   * @deprecated Use NEW API with CollectionConfiguration instead
   * 
   * @throws Error if called on a NEW API instance
   */
  getCollectionConfig(collection: Collection): CollectionConfig | undefined {
    if (this.isNewApi) {
      throw new Error('Cannot call getCollectionConfig() on NEW API instance. Use getCollectionConfigurations() instead.');
    }
    for (const [collections, config] of this.collectionsMap.entries()) {
      if (collections.includes(collection)) {
        return config;
      }
    }
    return undefined;
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

  /**
   * Creates a deep copy of this ReplicatorConfiguration.
   * 
   * @returns A new ReplicatorConfiguration with the same settings
   * 
   * @example
   * ```typescript
   * const originalConfig = new ReplicatorConfiguration([...], endpoint);
   * const clonedConfig = originalConfig.clone();
   * clonedConfig.setContinuous(true); // Doesn't affect original
   * ```
   */
  public clone(): ReplicatorConfiguration {
    let clonedConfig: ReplicatorConfiguration;
    
    if (this.isNewApi) {
      // NEW API: Clone collection configurations
      const clonedCollectionConfigs = this.collectionConfigurations.map(config => {
        const cloned = new CollectionConfiguration(config.getCollection());
        cloned.setChannels([...config.getChannels()]);
        cloned.setDocumentIDs([...config.getDocumentIDs()]);
        if (config.getPushFilter()) {
          // Re-create filter from string using Function constructor (safer than eval)
          const filterStr = config.getPushFilter();
          const filterFn = new Function('doc', 'flags', `return (${filterStr})(doc, flags)`) as ReplicationFilter;
          cloned.setPushFilter(filterFn);
        }
        if (config.getPullFilter()) {
          const filterStr = config.getPullFilter();
          const filterFn = new Function('doc', 'flags', `return (${filterStr})(doc, flags)`) as ReplicationFilter;
          cloned.setPullFilter(filterFn);
        }
        return cloned;
      });

      clonedConfig = new ReplicatorConfiguration(
        clonedCollectionConfigs,
        this.target
      );
    } else {
      // OLD API: Create config with endpoint only, then restore collectionsMap
      clonedConfig = new ReplicatorConfiguration(this.target);
      
      // Clone the collectionsMap
      for (const [collections, collConfig] of this.collectionsMap.entries()) {
        // Clone the CollectionConfig (handle undefined case)
        let clonedCollConfig: CollectionConfig | undefined;
        
        if (collConfig) {
          clonedCollConfig = new CollectionConfig();
          clonedCollConfig.setChannels([...collConfig.getChannels()]);
          clonedCollConfig.setDocumentIDs([...collConfig.getDocumentIDs()]);
          
          if (collConfig.getPushFilter()) {
            const filterStr = collConfig.getPushFilter();
            const filterFn = new Function('doc', 'flags', `return (${filterStr})(doc, flags)`) as (document: any, flags: string[]) => boolean;
            clonedCollConfig.setPushFilter(filterFn);
          }
          
          if (collConfig.getPullFilter()) {
            const filterStr = collConfig.getPullFilter();
            const filterFn = new Function('doc', 'flags', `return (${filterStr})(doc, flags)`) as (document: any, flags: string[]) => boolean;
            clonedCollConfig.setPullFilter(filterFn);
          }
        } else {
          // collConfig is undefined, keep it undefined
          clonedCollConfig = undefined;
        }
        
        // Add to cloned config's collectionsMap
        clonedConfig.collectionsMap.set([...collections], clonedCollConfig);
      }
    }

    // Copy all other properties
    clonedConfig.setContinuous(this.getContinuous());
    clonedConfig.setHeaders({ ...this.getHeaders() });
    clonedConfig.setAuthenticator(this.getAuthenticator());
    clonedConfig.setPinnedServerCertificate(this.getPinnedServerCertificate());
    clonedConfig.setAllowReplicatingInBackground(
      this.getAllowReplicatingInBackground()
    );
    clonedConfig.setAutoPurgeEnabled(this.getAutoPurgeEnabled());
    clonedConfig.setAcceptParentDomainCookies(
      this.getAcceptParentDomainCookies()
    );
    clonedConfig.setMaxAttempts(this.getMaxAttempts());
    clonedConfig.setMaxAttemptWaitTime(this.getMaxAttemptWaitTime());
    clonedConfig.setHeartbeat(this.getHeartbeat());
    clonedConfig.setReplicatorType(this.getReplicatorType());
    clonedConfig.setAcceptOnlySelfSignedCerts(
      this.getAcceptOnlySelfSignedCerts()
    );

    return clonedConfig;
  }

  /**
   * Converts this configuration to a JSON object for the native layer.
   * 
   * **Dual API Support:**
   * - NEW API: collectionConfig is an array of {collection, config} objects
   * - OLD API: collectionConfig is an array of {collections, config} objects
   * 
   * The native layer automatically detects which format is being used.
   * 
   * @returns JSON object suitable for native bridge
   * 
   * @internal
   */
  toJson(): any {
    const config = {
      acceptParentDomainCookies: this.acceptParentDomainCookies,
      acceptSelfSignedCerts: this.acceptOnlySelfSignedCerts,
      allowReplicationInBackground: this.allowReplicatingInBackground,
      autoPurgeEnabled: this.autoPurgeEnabled,
      authenticator: null as any,
      collectionConfig: null as any,
      continuous: this.continuous,
      headers: null as any,
      heartbeat: this.heartbeat,
      maxAttempts: this.maxAttempts,
      maxAttemptWaitTime: this.maxAttemptWaitTime,
      pinnedServerCertificate: null as any,
      replicatorType: this.replicatorType,
      target: this.target.toJson(),
    };

    // Set headers
    config.headers = this.headers !== undefined ? this.headers : '';

    // Set pinned server certificate
    config.pinnedServerCertificate =
      this.pinnedServerCertificate !== undefined
        ? this.pinnedServerCertificate
        : '';

    // Set authenticator
    if (this.authenticator !== undefined) {
      config.authenticator = {
        type: this.authenticator.getType(),
        data: this.authenticator.toJson(),
      };
    } else {
      config.authenticator = '';
    }

    // Serialize collection configurations based on API type
    if (this.isNewApi) {
      // NEW API: Serialize as [{collection: {...}, config: {...}}, ...]
      // Validate all collections are from same database and scope
      if (!this.validateCollectionsScopeAndDatabase()) {
        throw new Error(
          'All collections must be from the same database and scope'
        );
      }

      const collectionConfigArray = this.collectionConfigurations.map(
        collectionConfig => collectionConfig.toJson()
      );
      config.collectionConfig = JSON.stringify(collectionConfigArray);
    } else {
      // OLD API: Serialize as [{collections: [{collection: {...}}], config: {...}}, ...]
      
      // Validate that collections have been added
      if (this.collectionsMap.size === 0) {
        throw new Error(
          'No collections specified in the configuration. Use addCollection() or addCollections() to add collections.'
        );
      }
      
      const collectionConfigArray: any[] = [];
      
      for (const [collections, collConfig] of this.collectionsMap.entries()) {
        const collectionsArray = collections.map(c => {
          return {
            collection: {
              name: c.name,
              scopeName: c.scope.name,
              databaseName: c.database.getUniqueName(),
            }
          };
        });

        // Handle undefined/null collConfig (when addCollection was called without config)
        let configJson;
        if (collConfig && typeof collConfig.toJson === 'function') {
          configJson = collConfig.toJson();
        } else {
          configJson = {
            channels: [],
            documentIDs: [],
            pullFilter: undefined,
            pushFilter: undefined,
          };
        }

        const configItem = {
          collections: collectionsArray,
          config: configJson,
        };
        
        collectionConfigArray.push(configItem);
      }
      
      config.collectionConfig = JSON.stringify(collectionConfigArray);
    }

    return config;
  }

  /**
   * Validates that all collections are from the same database and scope.
   * 
   * @returns true if all collections are compatible, false otherwise
   * 
   * @private
   */
  private validateCollectionsScopeAndDatabase(): boolean {
    if (this.collectionConfigurations.length === 0) {
      return false;
    }

    const firstCollection = this.collectionConfigurations[0].getCollection();
    const expectedDatabaseName = firstCollection.database.getUniqueName();
    const expectedScopeName = firstCollection.scope.name;

    for (const config of this.collectionConfigurations) {
      const collection = config.getCollection();
      if (
        collection.database.getUniqueName() !== expectedDatabaseName ||
        collection.scope.name !== expectedScopeName
      ) {
        return false;
      }
    }

    return true;
  }
}
