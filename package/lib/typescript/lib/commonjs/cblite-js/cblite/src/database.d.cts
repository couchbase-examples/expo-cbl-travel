export const __esModule: boolean;
export const LogDomain: {};
export const LogLevel: {};
export const MaintenanceType: {};
/**
 * A Couchbase Lite database.
 */
export class Database {
    /**
     * Deletes a database.
     *
     * @function
     */
    static deleteDatabase(databaseName: any, directory: any): Promise<void>;
    /**
     * Checks whether a database of the given name exists in the given directory or not.
     *
     * @function
     */
    static exists(name: any, directory: any): Promise<any>;
    /**
     * Set log level for the given log domain.
     *
     * @function
     */
    static setLogLevel(domain: any, level: any): any;
    /**
     * The default scope name constant
     *
     * @property
     */
    static defaultScopeName: string;
    /**
     * The default collection name constant
     *
     * @property
     */
    static defaultCollectionName: string;
    constructor(_databaseName: any, _databaseConfig?: any);
    _isClosed: boolean;
    _engine: any;
    log: _databaseLogging.DatabaseLogging;
    _databaseName: any;
    _databaseConfig: any;
    getEngine(): any;
    /**
     * Open a database with the given name and configuration.
     *
     * @function
     */
    open(): any;
    /**
     * Changes the database’s encryption key, or removes
     * encryption if the new key is nil.
     *
     * @function
     */
    changeEncryptionKey(newKey: any): Promise<void>;
    /**
     * Close the database.  This will release all resources associated with the database.
     *
     * @function
     */
    close(): any;
    /**
     * @deprecated compact is deprecated. Use performMaintenance instead.
     *
     * @function
     */
    compact(): any;
    /**
     * Performs database maintenance.
     *
     * @function
     */
    performMaintenance(maintenanceType: any): any;
    /**
     * Copy database
     *
     * @function
     */
    copy(path: any, name: any, config: any): any;
    /**
     * Deletes a database.
     *
     * @function
     */
    deleteDatabase(): any;
    /**
     * Return the database's path.
     *
     * @function
     */
    getPath(): Promise<any>;
    /**
     * Return the database name
     *
     * @function
     */
    getName(): any;
    /**
     * Returns a READONLY config object which will throw a runtime exception when any setter methods are called.
     *
     * @function
     */
    getConfig(): any;
    /**
     * TODO - Fix with QUEUE
     */
    inBatch(fn: any): Promise<never>;
    /**
     * Set log level for the given log domain.
     *
     * @function
     */
    setLogLevel(domain: any, level: any): any;
    /**
     * Get the default Scope.
     *
     * @function
     */
    defaultScope(): Promise<_scope.Scope>;
    /**
     * Get a scope object by name. As the scope cannot exist by itself without having a collection, null value will be returned if there are no collections under the given scope’s name. Note: The default scope is exceptional, and it will always be returned.
     *
     * @function
     */
    scope(scopeName: any): Promise<_scope.Scope>;
    /**
     * Get scope names that have at least one collection. Note: the default scope is exceptional as it will always be listed even though there are no collections under it.
     *
     * @function
     */
    scopes(): Promise<_scope.Scope[]>;
    /**
     * Get the default Collection.
     *
     * @function
     */
    defaultCollection(): Promise<_collection.Collection>;
    /**
     * Get a collection in the specified scope by name. If the collection does not exist, an error will be returned.
     *
     * @function
     */
    collection(collectionName: any, scopeOrName: any): Promise<_collection.Collection>;
    /**
     * Get all collections in the specified scope.
     *
     * @function
     */
    collections(scopeOrName: any): Promise<_collection.Collection[]>;
    /**
     * Create a named collection in the specified scope. If the collection already exists, the existing collection will be returned.
     *
     * @function
     */
    createCollection(collectionName: any, scopeOrName: any): Promise<_collection.Collection>;
    /**
     * Delete a collection by name in the specified scope. If the collection doesn’t exist, an error will be thrown
     *
     * @function
     */
    deleteCollection(collectionOrName: any, scopeName: any): any;
    /**
     * @deprecated deleteDocument is deprecated. Use Collection deleteDocument instead.
     *
     * @function
     */
    deleteDocument(document: any, concurrencyControl?: any): any;
    /**
     * @deprecated purgeDocument is deprecated. Use Collection purgeDocument instead.
     *
     * @function
     */
    purgeDocument(document: any): any;
    /**
     * @deprecated getCount is deprecated. Use Collection getCount instead.
     *
     * @function
     */
    getCount(): Promise<any>;
    /**
     * @deprecated getDocument is deprecated. Use Collection getDocument instead.
     *
     * @function
     */
    getDocument(id: any): Promise<any>;
    /**
     * @deprecated save is deprecated. Use Collection save instead.
     *
     * @function
     */
    save(document: any, concurrencyControl?: any): Promise<void>;
    /**
     * @deprecated createIndex is deprecated. Use Collection createIndex instead.
     *
     * @function
     */
    createIndex(indexName: any, index: any): any;
    /**
     * @deprecated getIndexes is deprecated. Use Collection getIndexes instead.
     *
     * @function
     */
    getIndexes(): Promise<any>;
    /**
     * @deprecated deleteIndex is deprecated. Use Collection deleteIndex instead.
     *
     * @function
     */
    deleteIndex(indexName: any): any;
    /**
     * Creates a Query object from the given query string.
     *
     * @function
     */
    createQuery(queryString: any): _query.Query;
}
import _databaseLogging = require("./database-logging.cjs");
import _scope = require("./scope.cjs");
import _collection = require("./collection.cjs");
import _query = require("./query.cjs");
//# sourceMappingURL=database.d.cts.map