import { Document } from './document';
import { MutableDocument } from './mutable-document';
import { DatabaseConfiguration } from './database-configuration';
import { DatabaseLogging } from './database-logging';
import { AbstractIndex } from './abstract-index';
import { ConcurrencyControl } from './concurrency-control';
import { ICoreEngine } from '../core-types';
import { Collection } from './collection';
import { Scope } from './scope';
import { Query } from './query';
export declare enum LogDomain {
    ALL = "ALL",
    DATABASE = "DATABASE",
    NETWORK = "NETWORK",
    QUERY = "QUERY",
    REPLICATOR = "REPLICATOR"
}
export declare enum LogLevel {
    DEBUG = 0,
    VERBOSE = 1,
    INFO = 2,
    WARNING = 3,
    ERROR = 4,
    NONE = 5
}
export declare enum MaintenanceType {
    COMPACT = 0,
    REINDEX = 1,
    INTEGRITY_CHECK = 2,
    OPTIMIZE = 3,
    FULL_OPTIMIZE = 4
}
/**
 * A Couchbase Lite database.
 */
export declare class Database {
    private _databaseName;
    private _databaseConfig;
    private _isClosed;
    private _engine;
    log: DatabaseLogging;
    constructor(_databaseName: string, _databaseConfig?: DatabaseConfiguration);
    getEngine(): ICoreEngine;
    /**
     * Open a database with the given name and configuration.
     *
     * @function
     */
    open(): Promise<void>;
    /**
     * Changes the database’s encryption key, or removes
     * encryption if the new key is nil.
     *
     * @function
     */
    changeEncryptionKey(newKey: string | null): Promise<void>;
    /**
     * Close the database.  This will release all resources associated with the database.
     *
     * @function
     */
    close(): Promise<void>;
    /**
     * @deprecated compact is deprecated. Use performMaintenance instead.
     *
     * @function
     */
    compact(): Promise<void>;
    /**
     * Performs database maintenance.
     *
     * @function
     */
    performMaintenance(maintenanceType: MaintenanceType): Promise<void>;
    /**
     * Copy database
     *
     * @function
     */
    copy(path: string, name: string, config: DatabaseConfiguration): Promise<void>;
    /**
     * Deletes a database.
     *
     * @function
     */
    deleteDatabase(): Promise<void>;
    /**
     * Deletes a database.
     *
     * @function
     */
    static deleteDatabase(databaseName: string, directory: string): Promise<void>;
    /**
     * Return the database's path.
     *
     * @function
     */
    getPath(): Promise<string>;
    /**
     * Checks whether a database of the given name exists in the given directory or not.
     *
     * @function
     */
    static exists(name: string, directory: string): Promise<boolean>;
    /**
     * Return the database name
     *
     * @function
     */
    getName(): string;
    /**
     * Returns a READONLY config object which will throw a runtime exception when any setter methods are called.
     *
     * @function
     */
    getConfig(): DatabaseConfiguration;
    /**
     * TODO - Fix with QUEUE
     */
    inBatch(fn: () => void): Promise<void>;
    /**
     * Set log level for the given log domain.
     *
     * @function
     */
    static setLogLevel(domain: LogDomain, level: LogLevel): Promise<void>;
    /**
     * Set log level for the given log domain.
     *
     * @function
     */
    setLogLevel(domain: LogDomain, level: LogLevel): Promise<void>;
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
    /**
     * Get the default Scope.
     *
     * @function
     */
    defaultScope(): Promise<Scope>;
    /**
     * Get a scope object by name. As the scope cannot exist by itself without having a collection, null value will be returned if there are no collections under the given scope’s name. Note: The default scope is exceptional, and it will always be returned.
     *
     * @function
     */
    scope(scopeName: string): Promise<Scope>;
    /**
     * Get scope names that have at least one collection. Note: the default scope is exceptional as it will always be listed even though there are no collections under it.
     *
     * @function
     */
    scopes(): Promise<Scope[]>;
    /**
     * Get the default Collection.
     *
     * @function
     */
    defaultCollection(): Promise<Collection>;
    /**
     * Get a collection in the specified scope by name. If the collection does not exist, an error will be returned.
     *
     * @function
     */
    collection(collectionName: string): Promise<Collection>;
    collection(collectionName: string, scope: Scope): Promise<Collection>;
    collection(collectionName: string, scopeName: string): Promise<Collection>;
    /**
     * Get all collections in the specified scope.
     *
     * @function
     */
    collections(): Promise<Collection[]>;
    collections(scope: Scope): Promise<Collection[]>;
    collections(scope: string): Promise<Collection[]>;
    /**
     * Create a named collection in the specified scope. If the collection already exists, the existing collection will be returned.
     *
     * @function
     */
    createCollection(collectionName: string): Promise<Collection>;
    createCollection(collectionName: string, scope: Scope): Promise<Collection>;
    createCollection(collectionName: string, scopeName: string): Promise<Collection>;
    /**
     * Delete a collection by name in the specified scope. If the collection doesn’t exist, an error will be thrown
     *
     * @function
     */
    deleteCollection(collection: Collection): Promise<void>;
    deleteCollection(collectionName: string, scopeName: string): Promise<void>;
    /**
     * @deprecated deleteDocument is deprecated. Use Collection deleteDocument instead.
     *
     * @function
     */
    deleteDocument(document: Document, concurrencyControl?: ConcurrencyControl): Promise<void>;
    /**
     * @deprecated purgeDocument is deprecated. Use Collection purgeDocument instead.
     *
     * @function
     */
    purgeDocument(document: Document): Promise<void>;
    /**
     * @deprecated getCount is deprecated. Use Collection getCount instead.
     *
     * @function
     */
    getCount(): Promise<number>;
    /**
     * @deprecated getDocument is deprecated. Use Collection getDocument instead.
     *
     * @function
     */
    getDocument(id: string): Promise<Document>;
    /**
     * @deprecated save is deprecated. Use Collection save instead.
     *
     * @function
     */
    save(document: MutableDocument, concurrencyControl?: ConcurrencyControl): Promise<void>;
    /**
     * @deprecated createIndex is deprecated. Use Collection createIndex instead.
     *
     * @function
     */
    createIndex(indexName: string, index: AbstractIndex): Promise<void>;
    /**
     * @deprecated getIndexes is deprecated. Use Collection getIndexes instead.
     *
     * @function
     */
    getIndexes(): Promise<string[]>;
    /**
     * @deprecated deleteIndex is deprecated. Use Collection deleteIndex instead.
     *
     * @function
     */
    deleteIndex(indexName: string): Promise<void>;
    /**
     * Creates a Query object from the given query string.
     *
     * @function
     */
    createQuery(queryString: string): Query;
}
//# sourceMappingURL=database.d.ts.map