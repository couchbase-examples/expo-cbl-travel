"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collection = void 0;
var _scope = require("./scope.cjs");
var _engineLocator = require("./engine-locator.cjs");
var _document = require("./document.cjs");
class Collection {
  //used for engine calls
  _engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);

  //change listener support

  _didStartListener = false;

  //document change listener support

  constructor(name, scope, database) {
    this.name = name ?? '';
    this.scope = scope ?? new _scope.Scope('', database);
    this.database = database;
    this._documentChangeListener = new Map();
    this._didStartDocumentListener = new Map();
  }

  /**
   * Collection's database
   *
   * @property
   */

  /**
   * returns Collection's fully qualified name in the '<scope-name>.<collection-name>' format.
   *
   * @property
   */
  fullName = () => `${this.scope.name}.${this.name}`;

  /**
   * Collection's name.
   *
   * @property
   */

  /**
   * Collection's scope.
   *
   * @property
   */

  /**
   * Set a given CollectionChangeListener to the collection.
   *
   * @function
   */
  async addChangeListener(listener) {
    this._changeListener = listener;
    const token = this.uuid();
    if (!this._didStartListener) {
      await this._engine.collection_AddChangeListener({
        name: this.scope.database.getName(),
        scopeName: this.scope.name,
        collectionName: this.name,
        changeListenerToken: token
      }, (data, err) => {
        if (err) {
          throw err;
        }
        this.notifyChangeListeners(data);
      });
      this._didStartListener = true;
      return token;
    } else {
      throw new Error('Listener already started');
    }
  }

  /**
   * Set a given Collection Document Change Listener to a given document in a collection.
   *
   * @function
   */
  async addDocumentChangeListener(documentId, listener) {
    const token = this.uuid();
    if (!this._didStartDocumentListener.has(documentId) && !this._documentChangeListener[documentId]) {
      await this._engine.collection_AddDocumentChangeListener({
        name: this.scope.database.getName(),
        scopeName: this.scope.name,
        collectionName: this.name,
        changeListenerToken: token,
        documentId: documentId
      }, (data, err) => {
        if (err) {
          throw err;
        }
        this.notifyDocumentChangeListeners(data);
      });
      this._documentChangeListener.set(documentId, listener);
      this._didStartDocumentListener[documentId] = true;
      return token;
    } else {
      throw new Error(`Listener for document ${documentId} already started`);
    }
  }

  /**
   * Total number of documents in the collection.
   *
   * @function
   */
  count() {
    return this._engine.collection_GetCount({
      name: this.scope.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name
    });
  }

  /**
   * Create an index with the index name and AbstractIndex.
   *
   * @function
   */
  createIndex(indexName, index) {
    return this._engine.collection_CreateIndex({
      name: this.scope.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      indexName: indexName,
      index: index.toJson()
    });
  }

  /**
   * Delete a document from the collection. The default concurrency control, lastWriteWins,
   * will be used when there is conflict during delete. If the document doesn’t exist in the
   * collection, an error will be thrown.
   *
   * When deleting a document that already belongs to a collection, the collection instance of
   * the document and this collection instance must be the same, otherwise, an
   * error will be thrown.
   *
   * Throws an Error if the collection is deleted or the database is closed.
   *
   * @function
   */
  deleteDocument(document, concurrencyControl = null) {
    const id = document.getId();
    return this._engine.collection_DeleteDocument({
      name: this.scope.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      docId: id,
      concurrencyControl: concurrencyControl
    });
  }

  /**
   * Delete an index by name.
   *
   * @function
   */
  deleteIndex(indexName) {
    return this._engine.collection_DeleteIndex({
      name: this.scope.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      indexName: indexName
    });
  }

  /**
   * Get an existing document by document ID.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  async document(id) {
    const docJson = await this._engine.collection_GetDocument({
      docId: id,
      name: this.scope.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name
    });
    // @ts-ignore
    if (docJson && docJson._id) {
      // @ts-ignore
      const data = docJson._data;
      // @ts-ignore
      const sequence = docJson._sequence;
      // @ts-ignore
      const retId = docJson._id;
      return Promise.resolve(new _document.Document(retId, sequence, data));
    } else {
      return Promise.resolve(undefined);
    }
  }

  /**
     * Get the expiration date set to the document of the given id.
      * Throws an error, if the collection is deleted or the database is closed.
     *
     * @function
     */
  async getDocumentExpiration(id) {
    const date = await this._engine.collection_GetDocumentExpiration({
      docId: id,
      name: this.scope.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name
    });
    if (date !== null && date.date !== null) {
      return date.date;
    } else {
      return null;
    }
  }

  /**
   * Return ICoreEngine instance.
   *
   * @function
   */
  getEngine() {
    return this._engine;
  }

  /**
   * Return all index names
   *
   * @function
   */
  async indexes() {
    const indexes = await this._engine.collection_GetIndexes({
      name: this.scope.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name
    });
    return indexes.indexes;
  }

  /**
   * send data to the listener
   *
   * @function
   */
  notifyChangeListeners(data) {
    this._changeListener(data);
  }

  /**
   * send data to the document change listener
   *
   * @function
   */
  notifyDocumentChangeListeners(data) {
    const documentId = data.documentId;
    const changeListener = this._documentChangeListener.get(documentId);
    changeListener({
      documentId: documentId,
      collection: this,
      database: this.database
    });
  }

  /**
   * Purge a document by id from the collection. If the document doesn’t exist in the
   * collection, an error will be thrown.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  purge(document) {
    return this._engine.collection_PurgeDocument({
      name: this.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      docId: document.getId()
    });
  }

  /**
   * Purge a document by id from the collection. If the document doesn’t exist in the
   * collection, an error will be thrown.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  purgeById(documentId) {
    return this._engine.collection_PurgeDocument({
      name: this.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      docId: documentId
    });
  }

  /**
   * Remove the collection change listener.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  async removeChangeListener(token) {
    await this._engine.collection_RemoveChangeListener({
      name: this.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      changeListenerToken: token
    });
  }
  /**
   * Remove the collection document change listener.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  async removeDocumentChangeListener(token) {
    await this._engine.collection_RemoveDocumentChangeListener({
      name: this.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      changeListenerToken: token
    });
  }

  /**
   * Save a document into the collection. The default concurrency control, lastWriteWins, will
   * be used when there is conflict during save.
   *
   * When saving a document that already belongs to a collection, the collection instance of
   * the document and this collection instance must be the same, otherwise, an
   * error will be thrown.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  async save(document, concurrencyControl = null) {
    const ret = await this._engine.collection_Save({
      id: document.getId(),
      document: document.toDictionary(),
      concurrencyControl: concurrencyControl,
      name: this.scope.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name
    });
    const id = ret._id;
    document.setId(id);
  }
  async setDocumentExpiration(id, expiration) {
    await this._engine.collection_SetDocumentExpiration({
      docId: id,
      name: this.database.getName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      expiration: expiration
    });
  }
  toJson() {
    return {
      name: this.name,
      scopeName: this.scope.name,
      databaseName: this.database.getName()
    };
  }
  uuid() {
    return this._engine.getUUID();
  }
}
exports.Collection = Collection;
//# sourceMappingURL=collection.cjs.map