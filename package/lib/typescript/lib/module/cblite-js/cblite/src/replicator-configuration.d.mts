export let ReplicatorType: {};
export class ReplicatorConfiguration {
    static ReplicatorType: {};
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
    static defaultContinuous: boolean;
    static defaultEnableAutoPurge: boolean;
    static defaultSelfSignedCertificateOnly: boolean;
    static defaultAcceptParentDomainCookies: boolean;
    static defaultAllowReplicatingInBackground: boolean;
    static defaultHeartbeat: number;
    static defaultMaxAttemptsSingleShot: number;
    static defaultMaxAttemptsWaitTime: number;
    constructor(target: any);
    target: any;
    replicatorType: any;
    collections: Map<any, any>;
    continuous: boolean;
    autoPurgeEnabled: boolean;
    heartbeat: number;
    acceptOnlySelfSignedCerts: boolean;
    acceptParentDomainCookies: boolean;
    allowReplicatingInBackground: boolean;
    maxAttempts: number;
    maxAttemptWaitTime: number;
    authenticator: any;
    headers: any;
    pinnedServerCertificate: any;
    /**
     * Add a collection used for the replication with an optional collection configuration. If the collection has
     * been added before, the previous added and its configuration if specified will be replaced. If the config is omitted or a null or undefined configuration is specified, a default empty configuration will be applied.
     *
     * @function
     */
    addCollection(collection: any, config: any): void;
    /**
     * Add multiple collections used for the replication with an optional shared collection configuration.
     * If any of the collections have been added before, the previously added collections and their
     * configuration if specified will be replaced. Adding an empty collection array will be no-ops. if
     * specified will be replaced. If a null or undefined configuration is specified, a default empty configuration will be
     * applied.
     *
     * @function
     */
    addCollections(collections: any, config: any): void;
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
    getAuthenticator(): any;
    /**
     * returns collections used for the replication.
     *
     * @function
     */
    getCollections(): any[];
    /**
     * returns a copy of the collection’s config. If the config needs to be changed for the collection, the
     * collection will need to be re-added with the updated config.
     *
     * @function
     */
    getCollectionConfig(collection: any): any;
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
    getHeaders(): any;
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
    getPinnedServerCertificate(): any;
    /**
     * returns the replicator type indicating the direction of the replicator.
     *
     * @function
     */
    getReplicatorType(): any;
    /**
     * Remove a group of collections from the configuration. If the collection doesn’t exist, this operation will be no ops.
     *
     * @function
     */
    removeCollections(collections: any): void;
    /**
     * Remove the collection. If the collection doesn’t exist, this operation will be no ops.
     *
     * @function
     */
    removeCollection(collection: any): void;
    /**
     *  Specify the replicator to accept any and only self-signed certs. Any non-self-signed certs will be rejected
     *  to avoid accidentally using this mode with the non-self-signed certs in production.
     *  Default value is ``ReplicatorConfiguration.defaultSelfSignedCertificateOnly``
     *
     * @function
     */
    setAcceptOnlySelfSignedCerts(selfSignedCerts: any): void;
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
    setAcceptParentDomainCookies(acceptParentDomainCookies: any): void;
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
    setAllowReplicatingInBackground(allowReplicatingInBackground: any): void;
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
    setAutoPurgeEnabled(autoPurgeEnabled: any): void;
    /**
     * The Authenticator to authenticate with a remote target.
     *
     * @function
     */
    setAuthenticator(authenticator: any): void;
    /**
     * The continuous flag indicating whether the replicator should stay
     * active indefinitely to replicate changed documents.
     *
     * @function
     */
    setContinuous(continuous: any): void;
    /**
     * Extra HTTP headers to send in all requests to the remote target.
     *
     * @function
     */
    setHeaders(headers: any): void;
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
    setHeartbeat(heartbeat: any): void;
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
    setMaxAttempts(maxAttempts: any): void;
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
    setMaxAttemptWaitTime(maxAttemptWaitTime: any): void;
    /**
     *  The remote target's SSL certificate.
     *
     *  Note: The pinned cert will be evaluated against any certs in a cert chain,
     *  and the cert chain will be valid only if the cert chain contains the pinned cert.
     *
     * @function
     */
    setPinnedServerCertificate(pinnedServerCertificate: any): void;
    /**
     * Replicator type indicating the direction of the replicator.
     *
     * @function
     */
    setReplicatorType(replicatorType: any): void;
    toJson(): {
        acceptParentDomainCookies: boolean;
        acceptSelfSignedCerts: boolean;
        allowReplicationInBackground: boolean;
        autoPurgeEnabled: boolean;
        authenticator: any;
        collectionConfig: any;
        continuous: boolean;
        headers: any;
        heartbeat: number;
        maxAttempts: number;
        maxAttemptWaitTime: number;
        pinnedServerCertificate: any;
        replicatorType: any;
        target: any;
    };
    checkCollectionsScopeAndDatabase(): boolean;
}
//# sourceMappingURL=replicator-configuration.d.mts.map