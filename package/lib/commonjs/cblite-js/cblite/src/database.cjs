"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MaintenanceType = exports.LogLevel = exports.LogDomain = exports.Database = void 0;
var _document = require("./document.cjs");
var _databaseLogging = require("./database-logging.cjs");
var _engineLocator = require("./engine-locator.cjs");
var _collection = require("./collection.cjs");
var _scope = require("./scope.cjs");
var _query = require("./query.cjs");
let LogDomain = exports.LogDomain = /*#__PURE__*/function (LogDomain) {
  LogDomain["ALL"] = "ALL";
  LogDomain["DATABASE"] = "DATABASE";
  LogDomain["NETWORK"] = "NETWORK";
  LogDomain["QUERY"] = "QUERY";
  LogDomain["REPLICATOR"] = "REPLICATOR";
  return LogDomain;
}({});
let LogLevel = exports.LogLevel = /*#__PURE__*/function (LogLevel) {
  LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
  LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
  LogLevel[LogLevel["INFO"] = 2] = "INFO";
  LogLevel[LogLevel["WARNING"] = 3] = "WARNING";
  LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
  LogLevel[LogLevel["NONE"] = 5] = "NONE";
  return LogLevel;
}({});
let MaintenanceType = exports.MaintenanceType = /*#__PURE__*/function (MaintenanceType) {
  MaintenanceType[MaintenanceType["COMPACT"] = 0] = "COMPACT";
  MaintenanceType[MaintenanceType["REINDEX"] = 1] = "REINDEX";
  MaintenanceType[MaintenanceType["INTEGRITY_CHECK"] = 2] = "INTEGRITY_CHECK";
  MaintenanceType[MaintenanceType["OPTIMIZE"] = 3] = "OPTIMIZE";
  MaintenanceType[MaintenanceType["FULL_OPTIMIZE"] = 4] = "FULL_OPTIMIZE";
  return MaintenanceType;
}({});
/**
 * A Couchbase Lite database.
 */
class Database {
  _isClosed = false;
  _engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);
  log = new _databaseLogging.DatabaseLogging(this);
  constructor(_databaseName, _databaseConfig = null) {
    this._databaseName = _databaseName;
    this._databaseConfig = _databaseConfig;
  }
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
      config: this._databaseConfig
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
  async changeEncryptionKey(newKey) {
    await this._engine.database_ChangeEncryptionKey({
      name: this._databaseName,
      newKey: newKey
    });
    this._databaseConfig.setEncryptionKey(newKey);
  }

  /**
   * Close the database.  This will release all resources associated with the database.
   *
   * @function
   */
  close() {
    const result = this._engine.database_Close({
      name: this._databaseName
    });
    this._isClosed = true;
    return result;
  }

  /**
   * @deprecated compact is deprecated. Use performMaintenance instead.
   *
   * @function
   */
  compact() {
    const args = {
      name: this._databaseName,
      maintenanceType: MaintenanceType.COMPACT
    };
    return this._engine.database_PerformMaintenance(args);
  }

  /**
   * Performs database maintenance.
   *
   * @function
   */
  performMaintenance(maintenanceType) {
    const args = {
      name: this._databaseName,
      maintenanceType: maintenanceType
    };
    return this._engine.database_PerformMaintenance(args);
  }

  /**
   * Copy database
   *
   * @function
   */
  copy(path, name, config) {
    return this._engine.database_Copy({
      name: this._databaseName,
      path: path,
      newName: name,
      config: config
    });
  }

  /**
   * Deletes a database.
   *
   * @function
   */
  deleteDatabase() {
    if (this._isClosed) {
      throw new Error('Cannot delete a closed database using this API.  Open the database first.');
    }
    return this._engine.database_Delete({
      name: this._databaseName
    });
  }

  /**
   * Deletes a database.
   *
   * @function
   */
  static async deleteDatabase(databaseName, directory) {
    const engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);
    const args = {
      databaseName: databaseName,
      directory: directory
    };
    await engine.database_DeleteWithPath(args);
  }

  /**
   * Return the database's path.
   *
   * @function
   */
  async getPath() {
    return (await this._engine.database_GetPath({
      name: this._databaseName
    })).path;
  }

  /**
   * Checks whether a database of the given name exists in the given directory or not.
   *
   * @function
   */
  static async exists(name, directory) {
    const engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);
    const args = {
      databaseName: name,
      directory: directory
    };
    const ret = await engine.database_Exists(args);
    return ret.exists;
  }

  /**
   * Return the database name
   *
   * @function
   */
  getName() {
    return this._databaseName;
  }

  /**
   * Returns a READONLY config object which will throw a runtime exception when any setter methods are called.
   *
   * @function
   */
  getConfig() {
    return this._databaseConfig;
  }

  /**
   * TODO - Fix with QUEUE
   */
  inBatch(fn) {
    fn();
    return Promise.reject(null);
  }
  /**
   * Set log level for the given log domain.
   *
   * @function
   */
  static setLogLevel(domain, level) {
    const engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);
    return engine.database_SetLogLevel({
      domain: domain,
      logLevel: level
    });
  }

  /**
   * Set log level for the given log domain.
   *
   * @function
   */
  setLogLevel(domain, level) {
    return this._engine.database_SetLogLevel({
      domain: domain,
      logLevel: level
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
  async defaultScope() {
    const scope = await this._engine.scope_GetDefault({
      name: this._databaseName
    });
    return new _scope.Scope(scope.name, this);
  }

  /**
   * Get a scope object by name. As the scope cannot exist by itself without having a collection, null value will be returned if there are no collections under the given scope’s name. Note: The default scope is exceptional, and it will always be returned.
   *
   * @function
   */
  async scope(scopeName) {
    try {
      const scope = await this._engine.scope_GetScope({
        name: this._databaseName,
        scopeName: scopeName
      });
      return new _scope.Scope(scope.name, this);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get scope names that have at least one collection. Note: the default scope is exceptional as it will always be listed even though there are no collections under it.
   *
   * @function
   */
  async scopes() {
    const results = await this._engine.scope_GetScopes({
      name: this._databaseName
    });
    const scopes = [];
    for (const scope of results.scopes) {
      scopes.push(new _scope.Scope(scope.name, this));
    }
    return scopes;
  }

  /**
   * Get the default Collection.
   *
   * @function
   */
  async defaultCollection() {
    const col = await this._engine.collection_GetDefault({
      name: this._databaseName
    });
    const scope = new _scope.Scope(col.scope.name, this);
    return new _collection.Collection(col.name, scope, this);
  }

  /**
   * Get a collection in the specified scope by name. If the collection does not exist, an error will be returned.
   *
   * @function
   */

  // eslint-disable-next-line no-dupe-class-members

  // eslint-disable-next-line no-dupe-class-members

  // eslint-disable-next-line no-dupe-class-members
  async collection(collectionName, scopeOrName) {
    let col;
    if (typeof scopeOrName === 'string') {
      col = await this._engine.collection_GetCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: scopeOrName
      });
    } else if (scopeOrName instanceof _scope.Scope) {
      col = await this._engine.collection_GetCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: scopeOrName.name
      });
    } else {
      col = await this._engine.collection_GetCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: Database.defaultScopeName
      });
    }
    const scope = new _scope.Scope(col.scope.name, this);
    return new _collection.Collection(col.name, scope, this);
  }

  /**
   * Get all collections in the specified scope.
   *
   * @function
   */
  // @ts-expect-error stupid overloading not working properly in IDE

  // eslint-disable-next-line no-dupe-class-members

  // eslint-disable-next-line no-dupe-class-members

  // eslint-disable-next-line no-dupe-class-members
  async collections(scopeOrName) {
    const collections = [];
    let colResults;
    if (typeof scopeOrName === 'string') {
      colResults = await this._engine.collection_GetCollections({
        name: this._databaseName,
        scopeName: scopeOrName
      });
    } else if (scopeOrName instanceof _scope.Scope) {
      colResults = await this._engine.collection_GetCollections({
        name: this._databaseName,
        scopeName: scopeOrName.name
      });
    } else {
      colResults = await this._engine.collection_GetCollections({
        name: this._databaseName,
        scopeName: Database.defaultScopeName
      });
    }
    for (const col of colResults.collections) {
      const scope = new _scope.Scope(col.scope.name, this);
      collections.push(new _collection.Collection(col.name, scope, this));
    }
    return collections;
  }

  /**
   * Create a named collection in the specified scope. If the collection already exists, the existing collection will be returned.
   *
   * @function
   */

  // eslint-disable-next-line no-dupe-class-members

  // eslint-disable-next-line no-dupe-class-members

  // eslint-disable-next-line no-dupe-class-members
  async createCollection(collectionName, scopeOrName) {
    let col;
    if (typeof scopeOrName === 'string') {
      col = await this._engine.collection_CreateCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: scopeOrName
      });
    } else if (scopeOrName instanceof _scope.Scope) {
      col = await this._engine.collection_CreateCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: scopeOrName.name
      });
    } else {
      col = await this._engine.collection_CreateCollection({
        name: this._databaseName,
        collectionName: collectionName,
        scopeName: Database.defaultScopeName
      });
    }
    const scope = new _scope.Scope(col.scope.name, this);
    return new _collection.Collection(col.name, scope, this);
  }

  /**
   * Delete a collection by name in the specified scope. If the collection doesn’t exist, an error will be thrown
   *
   * @function
   */

  // eslint-disable-next-line no-dupe-class-members

  // eslint-disable-next-line no-dupe-class-members
  deleteCollection(collectionOrName, scopeName) {
    if (typeof collectionOrName === 'string' && scopeName !== undefined) {
      return this._engine.collection_DeleteCollection({
        name: this._databaseName,
        collectionName: collectionOrName,
        scopeName: scopeName
      });
    } else if (collectionOrName instanceof _collection.Collection) {
      return this._engine.collection_DeleteCollection({
        name: this._databaseName,
        collectionName: collectionOrName.name,
        scopeName: collectionOrName.scope.name
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
  deleteDocument(document, concurrencyControl = null) {
    const id = document.getId();
    return this._engine.database_DeleteDocument({
      name: this._databaseName,
      docId: id,
      concurrencyControl: concurrencyControl
    });
  }

  /**
   * @deprecated purgeDocument is deprecated. Use Collection purgeDocument instead.
   *
   * @function
   */
  purgeDocument(document) {
    return this._engine.database_PurgeDocument({
      name: this._databaseName,
      docId: document.getId()
    });
  }

  /**
   * @deprecated getCount is deprecated. Use Collection getCount instead.
   *
   * @function
   */
  async getCount() {
    const count = await this._engine.database_GetCount({
      name: this._databaseName
    });
    return Promise.resolve(count.count);
  }

  /**
   * @deprecated getDocument is deprecated. Use Collection getDocument instead.
   *
   * @function
   */
  async getDocument(id) {
    const docJson = await this._engine.database_GetDocument({
      name: this._databaseName,
      docId: id
    });
    if (docJson) {
      // @ts-ignore
      const data = docJson._data;
      // @ts-ignore
      const sequence = docJson._sequence;
      // @ts-ignore
      const retId = docJson._id;
      return Promise.resolve(new _document.Document(retId, sequence, data));
    } else {
      return Promise.resolve(null);
    }
  }

  /**
   * @deprecated save is deprecated. Use Collection save instead.
   *
   * @function
   */
  async save(document, concurrencyControl = null) {
    const ret = await this._engine.database_Save({
      name: this._databaseName,
      id: document.getId(),
      document: document.toDictionary(),
      concurrencyControl: concurrencyControl
    });
    const id = ret._id;
    document.setId(id);
  }

  /**
   * @deprecated createIndex is deprecated. Use Collection createIndex instead.
   *
   * @function
   */
  createIndex(indexName, index) {
    indexName;
    index;
    return this._engine.database_CreateIndex({
      name: this._databaseName,
      indexName: indexName,
      index: index.toJson()
    });
  }

  /**
   * @deprecated getIndexes is deprecated. Use Collection getIndexes instead.
   *
   * @function
   */
  async getIndexes() {
    return (await this._engine.database_GetIndexes({
      name: this._databaseName
    })).indexes;
  }

  /**
   * @deprecated deleteIndex is deprecated. Use Collection deleteIndex instead.
   *
   * @function
   */
  deleteIndex(indexName) {
    return this._engine.database_DeleteIndex({
      name: this._databaseName,
      indexName: indexName
    });
  }

  /**
   * Creates a Query object from the given query string.
   *
   * @function
   */
  createQuery(queryString) {
    return new _query.Query(queryString, this);
  }
}
exports.Database = Database;
//# sourceMappingURL=database.cjs.map