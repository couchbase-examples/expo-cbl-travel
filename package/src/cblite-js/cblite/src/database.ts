import { Document } from './document';
import { MutableDocument } from './mutable-document';
import { DatabaseConfiguration } from './database-configuration';
import { DatabaseLogging } from './database-logging';
import { AbstractIndex } from './abstract-index';
import { EngineLocator } from './engine-locator';
import { ConcurrencyControl } from './concurrency-control';
import {
  CollectionsResult,
  DatabaseExistsArgs,
  ICoreEngine,
  ScopeArgs,
} from '../core-types';
import { Collection } from './collection';
import { Scope } from './scope';
import { Query } from './query';

export enum LogDomain {
  ALL = 'ALL',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  QUERY = 'QUERY',
  REPLICATOR = 'REPLICATOR',
}

export enum LogLevel {
  DEBUG = 0,
  VERBOSE = 1,
  INFO = 2,
  WARNING = 3,
  ERROR = 4,
  NONE = 5,
}

export enum MaintenanceType {
  COMPACT = 0,
  REINDEX = 1,
  INTEGRITY_CHECK = 2,
  OPTIMIZE = 3,
  FULL_OPTIMIZE = 4,
}

/**
 * A Couchbase Lite database.
 */
export class Database {
  private _isClosed = false;
  private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);
  public log = new DatabaseLogging(this);

  constructor(
    private _databaseName: string,
    private _databaseConfig: DatabaseConfiguration = null
  ) {}

  getEngine() {
    return this._engine;
  }

  /**
   * Open a database with the given name and configuration.
   *
   * @function
   */
  open() {
    const result = this._engine.database_Open({
      name: this._databaseName,
      config: this._databaseConfig,
    });
    this._isClosed = false;
    return result;
  }

  /**
   * Changes the database’s encryption key, or removes
   * encryption if the new key is nil.
   *
   * @function
   */
  async changeEncryptionKey(newKey: string | null): Promise<void> {
    await this._engine.database_ChangeEncryptionKey({
      name: this._databaseName,
      newKey: newKey,
    });
    this._databaseConfig.setEncryptionKey(newKey);
  }

  /**
   * Close the database.  This will release all resources associated with the database.
   *
   * @function
   */
  close() {
    const result = this._engine.database_Close({ name: this._databaseName });
    this._isClosed = true;
    return result;
  }

  /**
   * @deprecated compact is deprecated. Use performMaintenance instead.
   *
   * @function
   */
  compact(): Promise<void> {
    const args = {
      name: this._databaseName,
      maintenanceType: MaintenanceType.COMPACT,
    };
    return this._engine.database_PerformMaintenance(args);
  }

  /**
   * Performs database maintenance.
   *
   * @function
   */
  performMaintenance(maintenanceType: MaintenanceType): Promise<void> {
    const args = { name: this._databaseName, maintenanceType: maintenanceType };
    return this._engine.database_PerformMaintenance(args);
  }

  /**
   * Copy database
   *
   * @function
   */
  copy(
    path: string,
    name: string,
    config: DatabaseConfiguration
  ): Promise<void> {
    return this._engine.database_Copy({
      name: this._databaseName,
      path: path,
      newName: name,
      config: config,
    });
  }

  /**
   * Deletes a database.
   *
   * @function
   */
  deleteDatabase() {
    if (this._isClosed) {
      throw new Error(
        'Cannot delete a closed database using this API.  Open the database first.'
      );
    }
    return this._engine.database_Delete({ name: this._databaseName });
  }

  /**
   * Deletes a database.
   *
   * @function
   */
  static async deleteDatabase(databaseName: string, directory: string) {
    const engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);
    const args: DatabaseExistsArgs = {
      databaseName: databaseName,
      directory: directory,
    };
    await engine.database_DeleteWithPath(args);
  }

  /**
   * Return the database's path.
   *
   * @function
   */
  async getPath(): Promise<string> {
    return (await this._engine.database_GetPath({ name: this._databaseName }))
      .path;
  }

  /**
   * Checks whether a database of the given name exists in the given directory or not.
   *
   * @function
   */
  static async exists(name: string, directory: string): Promise<boolean> {
    const engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);
    const args: DatabaseExistsArgs = {
      databaseName: name,
      directory: directory,
    };
    const ret = await engine.database_Exists(args);
    return ret.exists;
  }

  /**
   * Return the database name
   *
   * @function
   */
  getName(): string {
    return this._databaseName;
  }

  /**
   * Returns a READONLY config object which will throw a runtime exception when any setter methods are called.
   *
   * @function
   */
  getConfig(): DatabaseConfiguration {
    return this._databaseConfig;
  }

  /**
   * TODO - Fix with QUEUE
   */
  inBatch(fn: () => void): Promise<void> {
    fn();
    return Promise.reject(null);
  }
  /**
   * Set log level for the given log domain.
   *
   * @function
   */
  static setLogLevel(domain: LogDomain, level: LogLevel): Promise<void> {
    const engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);
    return engine.database_SetLogLevel({
      domain: domain,
      logLevel: level,
    });
  }

  /**
   * Set log level for the given log domain.
   *
   * @function
   */
  setLogLevel(domain: LogDomain, level: LogLevel): Promise<void> {
    return this._engine.database_SetLogLevel({
      domain: domain,
      logLevel: level,
    });
  }

  /**
   * The default scope name constant
   *
   * @property
   */
  static defaultScopeName = '_default';

  /**
   * The default collection name constant
   *
   * @property
   */
  static defaultCollectionName = '_default';

  /**
   * Get the default Scope.
   *
   * @function
   */
  async defaultScope(): Promise<Scope> {
    const scope = await this._engine.scope_GetDefault({
      name: this._databaseName,
    });
    return new Scope(scope.name, this);
  }

  /**
   * Get a scope object by name. As the scope cannot exist by itself without having a collection, null value will be returned if there are no collections under the given scope’s name. Note: The default scope is exceptional, and it will always be returned.
   *
   * @function
   */
  async scope(scopeName: string): Promise<Scope> {
    try {
      const scope = await this._engine.scope_GetScope({
        name: this._databaseName,
        scopeName: scopeName,
      } as ScopeArgs);
      return new Scope(scope.name, this);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get scope names that have at least one collection. Note: the default scope is exceptional as it will always be listed even though there are no collections under it.
   *
   * @function
   */
  async scopes(): Promise<Scope[]> {
    const results = await this._engine.scope_GetScopes({
      name: this._databaseName,
    });
    const scopes: Scope[] = [];
    for (const scope of results.scopes) {
      scopes.push(new Scope(scope.name, this));
    }
    return scopes;
  }

  /**
   * Get the default Collection.
   *
   * @function
   */
  async defaultCollection(): Promise<Collection> {
    const col = await this._engine.collection_GetDefault({
      name: this._databaseName,
    });
    const scope = new Scope(col.scope.name, this);
    return new Collection(col.name, scope, this);
  }

  /**
   * Get a collection in the specified scope by name. If the collection does not exist, an error will be returned.
   *
   * @function
   */
  async collection(collectionName: string): Promise<Collection>;
  // eslint-disable-next-line no-dupe-class-members
  async collection(collectionName: string, scope: Scope): Promise<Collection>;
  // eslint-disable-next-line no-dupe-class-members
  async collection(
    collectionName: string,
    scopeName: string
  ): Promise<Collection>;
  // eslint-disable-next-line no-dupe-class-members
  async collection(
    collectionName: string,
    scopeOrName?: Scope | string
  ): Promise<Collection | null> {
    let col: Collection | undefined;
    if (typeof scopeOrName === 'string') {
      col = await this._engine.collection_GetCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: scopeOrName,
      });
    } else if (scopeOrName instanceof Scope) {
      col = await this._engine.collection_GetCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: scopeOrName.name,
      });
    } else {
      col = await this._engine.collection_GetCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: Database.defaultScopeName,
      });
    }
    const scope = new Scope(col.scope.name, this);
    return new Collection(col.name, scope, this);
  }

  /**
   * Get all collections in the specified scope.
   *
   * @function
   */
  // @ts-expect-error stupid overloading not working properly in IDE
  async collections(): Promise<Collection[]>;
  // eslint-disable-next-line no-dupe-class-members
  async collections(scope: Scope): Promise<Collection[]>;
  // eslint-disable-next-line no-dupe-class-members
  async collections(scope: string): Promise<Collection[]>;
  // eslint-disable-next-line no-dupe-class-members
  async collections(
    scopeOrName: Scope | string | undefined
  ): Promise<Collection[]> {
    const collections: Collection[] = [];
    let colResults: CollectionsResult | undefined;
    if (typeof scopeOrName === 'string') {
      colResults = await this._engine.collection_GetCollections({
        name: this._databaseName,
        scopeName: scopeOrName,
      });
    } else if (scopeOrName instanceof Scope) {
      colResults = await this._engine.collection_GetCollections({
        name: this._databaseName,
        scopeName: scopeOrName.name,
      });
    } else {
      colResults = await this._engine.collection_GetCollections({
        name: this._databaseName,
        scopeName: Database.defaultScopeName,
      });
    }
    for (const col of colResults.collections) {
      const scope = new Scope(col.scope.name, this);
      collections.push(new Collection(col.name, scope, this));
    }
    return collections;
  }

  /**
   * Create a named collection in the specified scope. If the collection already exists, the existing collection will be returned.
   *
   * @function
   */
  async createCollection(collectionName: string): Promise<Collection>;
  // eslint-disable-next-line no-dupe-class-members
  async createCollection(
    collectionName: string,
    scope: Scope
  ): Promise<Collection>;
  // eslint-disable-next-line no-dupe-class-members
  async createCollection(
    collectionName: string,
    scopeName: string
  ): Promise<Collection>;
  // eslint-disable-next-line no-dupe-class-members
  async createCollection(
    collectionName: string,
    scopeOrName?: Scope | string
  ): Promise<Collection> {
    let col: Collection | undefined;
    if (typeof scopeOrName === 'string') {
      col = await this._engine.collection_CreateCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: scopeOrName,
      });
    } else if (scopeOrName instanceof Scope) {
      col = await this._engine.collection_CreateCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: scopeOrName.name,
      });
    } else {
      col = await this._engine.collection_CreateCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: Database.defaultScopeName,
      });
    }
    const scope = new Scope(col.scope.name, this);
    return new Collection(col.name, scope, this);
  }

  /**
   * Delete a collection by name in the specified scope. If the collection doesn’t exist, an error will be thrown
   *
   * @function
   */
  deleteCollection(collection: Collection): Promise<void>;
  // eslint-disable-next-line no-dupe-class-members
  deleteCollection(collectionName: string, scopeName: string): Promise<void>;
  // eslint-disable-next-line no-dupe-class-members
  deleteCollection(
    collectionOrName: Collection | string,
    scopeName?: string
  ): Promise<void> {
    if (typeof collectionOrName === 'string' && scopeName !== undefined) {
      return this._engine.collection_DeleteCollection({
        name: this._databaseName,
        collectionName: collectionOrName,
        scopeName: scopeName,
      });
    } else if (collectionOrName instanceof Collection) {
      return this._engine.collection_DeleteCollection({
        name: this._databaseName,
        collectionName: collectionOrName.name,
        scopeName: collectionOrName.scope.name,
      });
    } else {
      throw new Error('Invalid arguments');
    }
  }

  /**
   * @deprecated deleteDocument is deprecated. Use Collection deleteDocument instead.
   *
   * @function
   */
  deleteDocument(
    document: Document,
    concurrencyControl: ConcurrencyControl = null
  ): Promise<void> {
    const id = document.getId();
    return this._engine.database_DeleteDocument({
      name: this._databaseName,
      docId: id,
      concurrencyControl: concurrencyControl,
    });
  }

  /**
   * @deprecated purgeDocument is deprecated. Use Collection purgeDocument instead.
   *
   * @function
   */
  purgeDocument(document: Document) {
    return this._engine.database_PurgeDocument({
      name: this._databaseName,
      docId: document.getId(),
    });
  }

  /**
   * @deprecated getCount is deprecated. Use Collection getCount instead.
   *
   * @function
   */
  async getCount(): Promise<number> {
    const count = await this._engine.database_GetCount({
      name: this._databaseName,
    });
    return Promise.resolve(count.count);
  }

  /**
   * @deprecated getDocument is deprecated. Use Collection getDocument instead.
   *
   * @function
   */
  async getDocument(id: string): Promise<Document> {
    const docJson = await this._engine.database_GetDocument({
      name: this._databaseName,
      docId: id,
    });
    if (docJson) {
      // @ts-ignore
      const data = docJson._data;
      // @ts-ignore
      const sequence = docJson._sequence;
      // @ts-ignore
      const retId = docJson._id;
      return Promise.resolve(new Document(retId, sequence, data));
    } else {
      return Promise.resolve(null);
    }
  }

  /**
   * @deprecated save is deprecated. Use Collection save instead.
   *
   * @function
   */
  async save(
    document: MutableDocument,
    concurrencyControl: ConcurrencyControl = null
  ): Promise<void> {
    const ret = await this._engine.database_Save({
      name: this._databaseName,
      id: document.getId(),
      document: document.toDictionary(),
      concurrencyControl: concurrencyControl,
    });

    const id = ret._id;
    document.setId(id);
  }

  /**
   * @deprecated createIndex is deprecated. Use Collection createIndex instead.
   *
   * @function
   */
  createIndex(indexName: string, index: AbstractIndex): Promise<void> {
    indexName;
    index;
    return this._engine.database_CreateIndex({
      name: this._databaseName,
      indexName: indexName,
      index: index.toJson(),
    });
  }

  /**
   * @deprecated getIndexes is deprecated. Use Collection getIndexes instead.
   *
   * @function
   */
  async getIndexes(): Promise<string[]> {
    return (
      await this._engine.database_GetIndexes({
        name: this._databaseName,
      })
    ).indexes;
  }

  /**
   * @deprecated deleteIndex is deprecated. Use Collection deleteIndex instead.
   *
   * @function
   */
  deleteIndex(indexName: string): Promise<void> {
    return this._engine.database_DeleteIndex({
      name: this._databaseName,
      indexName: indexName,
    });
  }

  /**
   * Creates a Query object from the given query string.
   *
   * @function
   */
  createQuery(queryString: string): Query {
    return new Query(queryString, this);
  }
}
