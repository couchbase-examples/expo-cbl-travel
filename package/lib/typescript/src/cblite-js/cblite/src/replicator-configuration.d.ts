import { Authenticator } from './authenticator';
import { Collection } from './collection';
import { CollectionConfiguration } from './collection-configuration';
import { CollectionConfig } from './collection-config';
import { Endpoint } from './endpoint';
export declare enum ReplicatorType {
    PUSH_AND_PULL = "PUSH_AND_PULL",
    PUSH = "PUSH",
    PULL = "PULL"
}
export declare class ReplicatorConfiguration {
    static readonly ReplicatorType: typeof ReplicatorType;
    static CBLReplicatorOptionCookies: string;
    static CBLReplicatorAuthOption: string;
    static CBLReplicatorAuthType: string;
    static CBLReplicatorAuthUserName: string;
    static CBLReplicatorAuthPassword: string;
    static CBLReplicatorAuthClientCert: string;
    static CBLAuthTypeBasic: string;
    static CBLAuthTypeSession: string;
    static CBLAuthTypeOpenIDConnect: string;
    static CBLAuthTypeClientCert: string;
    private continuous;
    private replicatorType;
    private authenticator;
    private pinnedServerCertificate;
    private headers;
    private heartbeat;
    private maxAttempts;
    private maxAttemptWaitTime;
    private allowReplicatingInBackground;
    private acceptOnlySelfSignedCerts;
    private autoPurgeEnabled;
    private acceptParentDomainCookies;
    private readonly collectionConfigurations;
    private target;
    private collectionsMap;
    private isNewApi;
    static defaultContinuous: boolean;
    static defaultEnableAutoPurge: boolean;
    static defaultSelfSignedCertificateOnly: boolean;
    static defaultAcceptParentDomainCookies: boolean;
    static defaultAllowReplicatingInBackground: boolean;
    static defaultHeartbeat: number;
    static defaultMaxAttemptsSingleShot: number;
    static defaultMaxAttemptsWaitTime: number;
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
    constructor(targetOrCollectionConfigs: CollectionConfiguration[] | Endpoint, target?: Endpoint);
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
    getCollectionConfigurations(): CollectionConfiguration[];
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
    getCollections(): Collection[];
    /**
     * Gets the replication endpoint/target.
     *
     * @returns The Endpoint object
     */
    getTarget(): Endpoint;
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
    addCollection(collection: Collection, config: CollectionConfig): void;
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
    addCollections(collections: Collection[], config: CollectionConfig): void;
    /**
     * **[OLD API]** Removes a collection from replication.
     *
     * @param collection - The collection to remove
     *
     * @deprecated Use NEW API constructor with CollectionConfiguration[] instead
     *
     * @throws Error if called on a NEW API instance
     */
    removeCollection(collection: Collection): void;
    /**
     * **[OLD API]** Removes multiple collections from replication.
     *
     * @param collections - Array of collections to remove
     *
     * @deprecated Use NEW API constructor with CollectionConfiguration[] instead
     *
     * @throws Error if called on a NEW API instance
     */
    removeCollections(collections: Collection[]): void;
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
    getCollectionConfig(collection: Collection): CollectionConfig | undefined;
    /**
     *  returns the setting used to specify the replicator to accept any and only self-signed certs. Any non-self-signed
     *  certs will be rejected to avoid accidentally using this mode with the non-self-signed certs in production.
     *
     * @function
     */
    getAcceptOnlySelfSignedCerts(): boolean;
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
    getAcceptParentDomainCookies(): boolean;
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
    getAllowReplicatingInBackground(): boolean;
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
    getAutoPurgeEnabled(): boolean;
    /**
     * returns the Authenticator to authenticate with a remote target.
     *
     * @function
     */
    getAuthenticator(): Authenticator;
    /**
     * returns the continuous flag indicating whether the replicator should stay
     * active indefinitely to replicate changed documents.
     *
     * @function
     */
    getContinuous(): boolean;
    /**
     * returns extra HTTP headers to send in all requests to the remote target.
     *
     * @function
     */
    getHeaders(): {
        [name: string]: string;
    };
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
    getHeartbeat(): number;
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
    getMaxAttempts(): number;
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
    getMaxAttemptWaitTime(): number;
    /**
     *  returns the string value of the remote target's SSL certificate that was previously set in the configuration.
     *
     *  Note: The pinned cert will be evaluated against any certs in a cert chain,
     *  and the cert chain will be valid only if the cert chain contains the pinned cert.
     *
     * @function
     */
    getPinnedServerCertificate(): string;
    /**
     * returns the replicator type indicating the direction of the replicator.
     *
     * @function
     */
    getReplicatorType(): ReplicatorType;
    /**
     *  Specify the replicator to accept any and only self-signed certs. Any non-self-signed certs will be rejected
     *  to avoid accidentally using this mode with the non-self-signed certs in production.
     *  Default value is ``ReplicatorConfiguration.defaultSelfSignedCertificateOnly``
     *
     * @function
     */
    setAcceptOnlySelfSignedCerts(selfSignedCerts: boolean): void;
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
    setAcceptParentDomainCookies(acceptParentDomainCookies: boolean): void;
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
    setAllowReplicatingInBackground(allowReplicatingInBackground: boolean): void;
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
    setAutoPurgeEnabled(autoPurgeEnabled: boolean): void;
    /**
     * The Authenticator to authenticate with a remote target.
     *
     * @function
     */
    setAuthenticator(authenticator: Authenticator): void;
    /**
     * The continuous flag indicating whether the replicator should stay
     * active indefinitely to replicate changed documents.
     *
     * @function
     */
    setContinuous(continuous: boolean): void;
    /**
     * Extra HTTP headers to send in all requests to the remote target.
     *
     * @function
     */
    setHeaders(headers: {
        [name: string]: string;
    }): void;
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
    setHeartbeat(heartbeat: number): void;
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
    setMaxAttempts(maxAttempts: number): void;
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
    setMaxAttemptWaitTime(maxAttemptWaitTime: number): void;
    /**
     *  The remote target's SSL certificate.
     *
     *  Note: The pinned cert will be evaluated against any certs in a cert chain,
     *  and the cert chain will be valid only if the cert chain contains the pinned cert.
     *
     * @function
     */
    setPinnedServerCertificate(pinnedServerCertificate: string): void;
    /**
     * Replicator type indicating the direction of the replicator.
     *
     * @function
     */
    setReplicatorType(replicatorType: ReplicatorType): void;
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
    clone(): ReplicatorConfiguration;
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
    toJson(): any;
    /**
     * Validates that all collections are from the same database and scope.
     *
     * @returns true if all collections are compatible, false otherwise
     *
     * @private
     */
    private validateCollectionsScopeAndDatabase;
}
//# sourceMappingURL=replicator-configuration.d.ts.map