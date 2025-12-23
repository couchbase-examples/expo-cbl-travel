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
import { LogDomain, LogLevel } from './log-sinks-enums';

// Re-export for backward compatibility with old API
export { LogDomain, LogLevel };

export enum MaintenanceType {
  // eslint-disable-next-line 
  COMPACT = 0,
  // eslint-disable-next-line 
  REINDEX = 1,
  // eslint-disable-next-line 
  INTEGRITY_CHECK = 2,
  // eslint-disable-next-line 
  OPTIMIZE = 3,
  // eslint-disable-next-line 
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
    // eslint-disable-next-line 
    private _databaseName: string,
    // eslint-disable-next-line 
    private _databaseConfig: DatabaseConfiguration = null,
    // eslint-disable-next-line
    private _databaseUniqueName: string = null
  ) { }

  getEngine() {
    return this._engine;
  }

  /**
   * Open a database with the given name and configuration.
   * Returns the unique internal name of the database which consists of the provided name and nanoId.
   * The unique name is used to allow multiple instances of the same database to be opened at the same time.
   * 
   * @function
   */
  async open(): Promise<string> {
    const { databaseUniqueName } = await this._engine.database_Open({
      name: this._databaseName,
      config: this._databaseConfig,
    });

    this._databaseUniqueName = databaseUniqueName;
    this._isClosed = false;
    return databaseUniqueName;
  }

  /**
   * Changes the database’s encryption key, or removes
   * encryption if the new key is nil.
   *
   * @function
   */
  async changeEncryptionKey(newKey: string | null): Promise<void> {
    await this._engine.database_ChangeEncryptionKey({
      name: this._databaseUniqueName,
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
    const result = this._engine.database_Close({ name: this._databaseUniqueName });
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
      name: this._databaseUniqueName,
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
    const args = { name: this._databaseUniqueName, maintenanceType: maintenanceType };
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
      name: this._databaseUniqueName,
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
    return this._engine.database_Delete({ name: this._databaseUniqueName });
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
    return (await this._engine.database_GetPath({ name: this._databaseUniqueName }))
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
   * Return the database unique name.
   * Unique name is generated by adding a nanoId to the database name.
   * This is used to allow multiple instances of the same database to be opened at the same time.
   *
   * @function
   */
  getUniqueName(): string {
    return this._databaseUniqueName;
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
      name: this._databaseUniqueName,
    });
    return new Scope(scope.name, this);
  }

  /**
   * Get a scope object by name. As the scope cannot exist by itself without having a collection, null value will be returned if there are no collections under the given scope’s name. Note: The default scope is exceptional, and it will always be returned.
   *
   * @function
   */
  async scope(scopeName: string): Promise<Scope | undefined> {
    try {
      const scope = await this._engine.scope_GetScope({
        name: this._databaseUniqueName,
        scopeName: scopeName,
      } as ScopeArgs);
      return new Scope(scope.name, this);
    } catch {
      return undefined;
    }
  }

  /**
   * Get scope names that have at least one collection. Note: the default scope is exceptional as it will always be listed even though there are no collections under it.
   *
   * @function
   */
  async scopes(): Promise<Scope[]> {
    const results = await this._engine.scope_GetScopes({
      name: this._databaseUniqueName,
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
      name: this._databaseUniqueName,
    });
    const scope = new Scope(col.scope.name, this);
    return new Collection(col.name, scope, this);
  }

  /**
   * Get a collection in the specified scope by name. If the collection does not exist, an error will be returned.
   *
   * @function
   */
  // eslint-disable-next-line 
  async collection(collectionName: string): Promise<Collection>;
  // eslint-disable-next-line 
  async collection(collectionName: string, scope: Scope): Promise<Collection>;
  // eslint-disable-next-line 
  async collection(collectionName: string, scopeName: string): Promise<Collection>;
  // eslint-disable-next-line no-dupe-class-members
  async collection(
    collectionName: string,
    scopeOrName?: Scope | string
  ): Promise<Collection | null> {
    let col: Collection | undefined;
    if (typeof scopeOrName === 'string') {
      col = await this._engine.collection_GetCollection({
        name: this._databaseUniqueName,
        collectionName: collectionName,
        scopeName: scopeOrName,
      });
    } else if (scopeOrName instanceof Scope) {
      col = await this._engine.collection_GetCollection({
        name: this._databaseUniqueName,
        collectionName: collectionName,
        scopeName: scopeOrName.name,
      });
    } else {
      col = await this._engine.collection_GetCollection({
        name: this._databaseUniqueName,
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
  // eslint-disable-next-line
  async collections(scope: Scope): Promise<Collection[]>;
  // eslint-disable-next-line
  async collections(scope: string): Promise<Collection[]>;
  // eslint-disable-next-line
  async collections(
    scopeOrName: Scope | string | undefined
  ): Promise<Collection[]> {
    const collections: Collection[] = [];
    let colResults: CollectionsResult | undefined;
    if (typeof scopeOrName === 'string') {
      colResults = await this._engine.collection_GetCollections({
        name: this._databaseUniqueName,
        scopeName: scopeOrName,
      });
    } else if (scopeOrName instanceof Scope) {
      colResults = await this._engine.collection_GetCollections({
        name: this._databaseUniqueName,
        scopeName: scopeOrName.name,
      });
    } else {
      colResults = await this._engine.collection_GetCollections({
        name: this._databaseUniqueName,
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
  // eslint-disable-next-line
  async createCollection(collectionName: string): Promise<Collection>;
  // eslint-disable-next-line
  async createCollection(collectionName: string, scope: Scope
  ): Promise<Collection>;
  // eslint-disable-next-line 
  async createCollection(collectionName: string, scopeName: string): Promise<Collection>;
  // eslint-disable-next-line
  async createCollection(
    collectionName: string,
    scopeOrName?: Scope | string
  ): Promise<Collection> {
    let col: Collection | undefined;
    if (typeof scopeOrName === 'string') {
      col = await this._engine.collection_CreateCollection({
        name: this._databaseUniqueName,
        collectionName: collectionName,
        scopeName: scopeOrName,
      });
    } else if (scopeOrName instanceof Scope) {
      col = await this._engine.collection_CreateCollection({
        name: this._databaseUniqueName,
        collectionName: collectionName,
        scopeName: scopeOrName.name,
      });
    } else {
      col = await this._engine.collection_CreateCollection({
        name: this._databaseUniqueName,
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
  // eslint-disable-next-line 
  deleteCollection(collection: Collection): Promise<void>;
  // eslint-disable-next-line
  deleteCollection(collectionName: string, scopeName: string): Promise<void>;
  // eslint-disable-next-line 
  deleteCollection(
    collectionOrName: Collection | string,
    scopeName?: string
  ): Promise<void> {
    if (typeof collectionOrName === 'string' && scopeName !== undefined) {
      return this._engine.collection_DeleteCollection({
        name: this._databaseUniqueName,
        collectionName: collectionOrName,
        scopeName: scopeName,
      });
    } else if (collectionOrName instanceof Collection) {
      return this._engine.collection_DeleteCollection({
        name: this._databaseUniqueName,
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
      name: this._databaseUniqueName,
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
      name: this._databaseUniqueName,
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
      name: this._databaseUniqueName,
    });
    return Promise.resolve(count.count);
  }

  /**
   * @deprecated getDocument is deprecated. Use Collection getDocument instead.
   *
   * @function
   */
  async getDocument(id: string): Promise<Document> {
    const docJson = await this._engine.collection_GetDocument({
      docId: id,
      name: this._databaseUniqueName,
      scopeName: "_default",
      collectionName: "_default",
    });
    const collection = await this.defaultCollection();
    // @ts-expect-error - _id is used in getId()
    if (docJson && docJson._id) {
      // @ts-expect-error - _data is used in getData()
      const data = docJson._data;
      // @ts-expect-error - _sequence is used in getSequence()
      const sequence = docJson._sequence;
      // @ts-expect-error _id exists in documents
      const retId = docJson._id;
      // @ts-expect-error - _revId is used in getRevisionID()
      const revisionID = docJson._revId;
      return Promise.resolve(new Document(retId, sequence, revisionID, collection, data));
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
    const ret = await this._engine.collection_Save({
      id: document.getId(),
      document: document.toJsonString(),
      blobs: document.blobsToJsonString(),
      concurrencyControl: concurrencyControl,
      name: this._databaseUniqueName,
      scopeName: "_default",
      collectionName: "_default",
    });

    document.setId(ret._id);
    document.setRevisionID(ret._revId);
    document.setSequence(ret._sequence);
  }

  /**
   * @deprecated createIndex is deprecated. Use Collection createIndex instead.
   *
   * @function
   */
  createIndex(indexName: string, index: AbstractIndex): Promise<void> {
    return this._engine.database_CreateIndex({
      name: this._databaseUniqueName,
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
        name: this._databaseUniqueName,
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
      name: this._databaseUniqueName,
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
