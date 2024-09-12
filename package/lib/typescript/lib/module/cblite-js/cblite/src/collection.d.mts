export class Collection {
    constructor(name: any, scope: any, database: any);
    _engine: any;
    _didStartListener: boolean;
    name: any;
    scope: any;
    database: any;
    _documentChangeListener: Map<any, any>;
    _didStartDocumentListener: Map<any, any>;
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
    fullName: () => string;
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
    addChangeListener(listener: any): Promise<any>;
    _changeListener: any;
    /**
     * Set a given Collection Document Change Listener to a given document in a collection.
     *
     * @function
     */
    addDocumentChangeListener(documentId: any, listener: any): Promise<any>;
    /**
     * Total number of documents in the collection.
     *
     * @function
     */
    count(): any;
    /**
     * Create an index with the index name and AbstractIndex.
     *
     * @function
     */
    createIndex(indexName: any, index: any): any;
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
    deleteDocument(document: any, concurrencyControl?: any): any;
    /**
     * Delete an index by name.
     *
     * @function
     */
    deleteIndex(indexName: any): any;
    /**
     * Get an existing document by document ID.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    document(id: any): Promise<any>;
    /**
       * Get the expiration date set to the document of the given id.
        * Throws an error, if the collection is deleted or the database is closed.
       *
       * @function
       */
    getDocumentExpiration(id: any): Promise<any>;
    /**
     * Return ICoreEngine instance.
     *
     * @function
     */
    getEngine(): any;
    /**
     * Return all index names
     *
     * @function
     */
    indexes(): Promise<any>;
    /**
     * send data to the listener
     *
     * @function
     */
    notifyChangeListeners(data: any): void;
    /**
     * send data to the document change listener
     *
     * @function
     */
    notifyDocumentChangeListeners(data: any): void;
    /**
     * Purge a document by id from the collection. If the document doesn’t exist in the
     * collection, an error will be thrown.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    purge(document: any): any;
    /**
     * Purge a document by id from the collection. If the document doesn’t exist in the
     * collection, an error will be thrown.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    purgeById(documentId: any): any;
    /**
     * Remove the collection change listener.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    removeChangeListener(token: any): Promise<void>;
    /**
     * Remove the collection document change listener.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    removeDocumentChangeListener(token: any): Promise<void>;
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
    save(document: any, concurrencyControl?: any): Promise<void>;
    setDocumentExpiration(id: any, expiration: any): Promise<void>;
    toJson(): {
        name: any;
        scopeName: any;
        databaseName: any;
    };
    uuid(): any;
}
//# sourceMappingURL=collection.d.mts.map