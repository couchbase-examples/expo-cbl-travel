import { Scope } from './scope';
import { AbstractIndex } from './abstract-index';
import { Database } from './database';
import { Document } from './document';
import { ConcurrencyControl } from './concurrency-control';
import { MutableDocument } from './mutable-document';
import { DocumentChangeListener, CollectionChangeListener, ICoreEngine } from '../core-types';
export declare class Collection {
    private _engine;
    private _changeListener;
    private _didStartListener;
    private _documentChangeListener;
    private _didStartDocumentListener;
    constructor(name: string | undefined, scope: Scope | undefined, database: Database);
    /**
     * Collection's database
     *
     * @property
     */
    database: Database;
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
    name: string;
    /**
     * Collection's scope.
     *
     * @property
     */
    scope: Scope;
    /**
     * Set a given CollectionChangeListener to the collection.
     *
     * @function
     */
    addChangeListener(listener: CollectionChangeListener): Promise<string>;
    /**
     * Set a given Collection Document Change Listener to a given document in a collection.
     *
     * @function
     */
    addDocumentChangeListener(documentId: string, listener: DocumentChangeListener): Promise<string>;
    /**
     * Total number of documents in the collection.
     *
     * @function
     */
    count(): Promise<{
        count: number;
    }>;
    /**
     * Create an index with the index name and AbstractIndex.
     *
     * @function
     */
    createIndex(indexName: string, index: AbstractIndex): Promise<void>;
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
    deleteDocument(document: Document, concurrencyControl?: ConcurrencyControl): Promise<void>;
    /**
     * Delete an index by name.
     *
     * @function
     */
    deleteIndex(indexName: string): Promise<void>;
    /**
     * Get an existing document by document ID.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    document(id: string): Promise<Document>;
    /**
       * Get the expiration date set to the document of the given id.
  
       * Throws an error, if the collection is deleted or the database is closed.
       *
       * @function
       */
    getDocumentExpiration(id: string): Promise<Date | null>;
    /**
     * Return ICoreEngine instance.
     *
     * @function
     */
    getEngine(): ICoreEngine;
    /**
     * Return all index names
     *
     * @function
     */
    indexes(): Promise<string[]>;
    /**
     * send data to the listener
     *
     * @function
     */
    private notifyChangeListeners;
    /**
     * send data to the document change listener
     *
     * @function
     */
    private notifyDocumentChangeListeners;
    /**
     * Purge a document by id from the collection. If the document doesn’t exist in the
     * collection, an error will be thrown.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    purge(document: Document): Promise<void>;
    /**
     * Purge a document by id from the collection. If the document doesn’t exist in the
     * collection, an error will be thrown.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    purgeById(documentId: string): Promise<void>;
    /**
     * Remove the collection change listener.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    removeChangeListener(token: string): Promise<void>;
    /**
     * Remove the collection document change listener.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    removeDocumentChangeListener(token: string): Promise<void>;
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
    save(document: MutableDocument, concurrencyControl?: ConcurrencyControl): Promise<void>;
    setDocumentExpiration(id: string, expiration: Date | null): Promise<void>;
    toJson(): any;
    private uuid;
}
//# sourceMappingURL=collection.d.ts.map