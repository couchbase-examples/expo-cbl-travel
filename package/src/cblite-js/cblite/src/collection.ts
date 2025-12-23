/**
 * ================================================================================
 * COLLECTION.TS - Couchbase Lite Collection Management
 * ================================================================================
 * 
 * OVERVIEW:
 * --------
 * A Collection is a container for documents within a Couchbase Lite database.
 * It provides a way to organize and manage related documents, similar to a 
 * table in a relational database or a collection in MongoDB.
 * 
 * ARCHITECTURE HIERARCHY:
 * ----------------------
 * Database
 *   └── Scope (namespace for collections, default: "_default")
 *         └── Collection (container for documents)
 *               └── Documents (JSON documents with unique IDs)
 * 
 * INITIALIZATION:
 * --------------
 * Collections are NOT created directly. They are obtained through the Database class:
 * 
 * Example 1 - Create a new collection:
 *   const database = new Database('myDatabase');
 *   await database.open();
 *   const collection = await database.createCollection('users', 'myScope');
 * 
 * Example 2 - Get existing collection:
 *   const collection = await database.collection('users', 'myScope');
 * 
 * Example 3 - Get default collection:
 *   const defaultCollection = await database.defaultCollection();
 * 
 * TYPICAL WORKFLOW:
 * ----------------
 * 1. Create/Get Collection from Database
 * 2. Save documents to the collection
 * 3. Query documents from the collection
 * 4. Listen for changes (optional)
 * 5. Create indexes for better query performance (optional)
 * 
 * EXAMPLE DATA FLOW:
 * -----------------
 * // Step 1: Get collection
 * const userCollection = await database.createCollection('users', 'myScope');
 * 
 * // Step 2: Save a document
 * const doc = new MutableDocument('user-123');
 * doc.setData({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   age: 30,
 *   createdAt: new Date().toISOString()
 * });
 * await userCollection.save(doc);
 * 
 * // Step 3: Retrieve document
 * const retrievedDoc = await userCollection.document('user-123');
 * console.log(retrievedDoc.getData()); 
 * // Output: { name: 'John Doe', email: 'john@example.com', age: 30, createdAt: '...' }
 * 
 * // Step 4: Listen for changes
 * const token = await userCollection.addChangeListener((data) => {
 *   console.log('Collection changed!');
 *   console.log('Changed document IDs:', data.documentIDs);  // Note: Capital IDs!
 *   console.log('Collection:', data.collection.name);
 * });
 * 
 * USED IN:
 * -------
 * - expo-example/service/collection/create.ts - Creating collections
 * - expo-example/service/document/save.ts - Saving documents to collections
 * - expo-example/app/collection/*.tsx - UI components for collection management
 * - Replication (for syncing data between devices/servers)
 * - Queries (for searching and filtering documents)
 */

import { Scope } from './scope';
import { EngineLocator } from './engine-locator';
import { AbstractIndex } from './abstract-index';
import { Database } from './database';
import { Document } from './document';
import { ConcurrencyControl } from './concurrency-control';
import { MutableDocument } from './mutable-document';

import {
  DocumentChangeListener,
  CollectionChangeListener,
  ICoreEngine,
} from '../core-types';
import { ListenerToken } from './listener-token';


/**
 * Interface representing the JSON serialization format of a Collection.
 * Used for transferring collection metadata between JavaScript and native layers.
 * 
 * Example JSON:
 * {
 *   name: "users",
 *   scopeName: "myScope",
 *   databaseName: "myDatabase_abc123"  // Unique database name with nanoId
 * }
 */
export interface CollectionJson {
  name: string;
  scopeName: string;
  databaseName: string;
}

/**
 * Collection class - Represents a collection of documents in Couchbase Lite.
 * 
 * A Collection is a container for documents and provides methods to:
 * - Save, retrieve, update, and delete documents
 * - Create indexes for faster queries
 * - Listen for changes to the collection or specific documents
 * - Manage document expiration
 * 
 * Collections belong to a Scope, which provides a namespace for organizing
 * related collections within a Database.
 */
export class Collection {
  /**
   * PRIVATE PROPERTIES
   * ==================
   */
  
  /**
   * _engine: The native engine interface for communicating with platform-specific code.
   * This is the bridge to Kotlin (Android) and Swift (iOS) implementations.
   * EngineLocator is a singleton that provides the appropriate engine based on the platform.
   */
  private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);

  /**
   * _changeListener: Callback function for collection-wide changes.
   * Triggered when any document in the collection is added, updated, or deleted.
   * 
   * VERIFIED: Actual callback data (see core-types.ts CollectionChange interface):
   * {
   *   collection: <Collection instance>,
   *   documentIDs: ['doc1', 'doc2', 'doc3']  // NOTE: Capital IDs, not lowercase
   * }
   * 
   * NOTE: There is NO database property! You can access database via collection.database
   */
  private _changeListener: CollectionChangeListener;
  
  /**
   * _didStartListener: Flag to prevent multiple collection change listeners.
   * Currently, only one collection change listener is supported per collection instance.
   */
  private _didStartListener = false;

  /**
   * _documentChangeListener: Map storing listeners for individual documents.
   * Key: documentId (e.g., 'user-123')
   * Value: Callback function triggered when that specific document changes
   * 
   * Example:
   * Map {
   *   'user-123' => (data) => console.log('User 123 changed'),
   *   'user-456' => (data) => console.log('User 456 changed')
   * }
   */
  private _documentChangeListener: Map<string, DocumentChangeListener>;
  
  /**
   * _docListenerTokens: Maps listener tokens to document IDs for cleanup.
   * Key: token (returned from addDocumentChangeListener)
   * Value: documentId
   * 
   * This enables proper cleanup when removeDocumentChangeListener is called,
   * as we need to know which documentId to remove from _documentChangeListener.
   * 
   * Example:
   * Map {
   *   'uuid-abc-123' => 'user-123',
   *   'uuid-def-456' => 'order-456'
   * }
   */
  private _docListenerTokens: Map<string, string>;


  // 
  private _cblListenerTokensByUuid: Map<string, ListenerToken> = new Map();
  private _cblDocumentListenerTokensByUuid: Map<string, ListenerToken> = new Map();


  /**
   * CONSTRUCTOR
   * ===========
   * Creates a Collection instance. This constructor is called internally by the Database class.
   * 
   * DO NOT call this constructor directly. Use:
   * - database.createCollection('collectionName', 'scopeName')
   * - database.collection('collectionName', 'scopeName')
   * - database.defaultCollection()
   * 
   * @param name - The name of the collection (e.g., 'users', 'products')
   * @param scope - The Scope object this collection belongs to
   * @param database - The parent Database object
   * 
   * Example internal usage (from database.ts):
   *   const scope = new Scope('myScope', database);
   *   const collection = new Collection('users', scope, database);
   */
  constructor(
    name: string | undefined,
    scope: Scope | undefined,
    database: Database
  ) {
    // Define immutable properties using Object.defineProperty
    // This provides runtime protection in addition to TypeScript's compile-time protection
    // Users cannot modify these properties, preventing bugs and data corruption
    const propertyOptions = {
      writable: false,      // Cannot be changed
      configurable: false,  // Cannot be deleted or redefined
      enumerable: true      // Visible in Object.keys(), JSON.stringify()
    };

    Object.defineProperty(this, 'name', { value: name ?? '', ...propertyOptions });
    Object.defineProperty(this, 'scope', { value: scope ?? new Scope('', database), ...propertyOptions });
    Object.defineProperty(this, 'database', { value: database, ...propertyOptions });

    this._documentChangeListener = new Map<string, DocumentChangeListener>();
    this._docListenerTokens = new Map<string, string>();
  }

  /**
   * PUBLIC PROPERTIES
   * =================
   */
  
  /**
   * database: Reference to the parent Database object this collection belongs to.
   * 
   * This is a Database object, NOT a string!
   * 
   * This property is immutable and cannot be changed after construction.
   * Attempting to modify it will throw a TypeError at runtime.
   * 
   * Example usage:
   *   // This is a Database object
   *   const db = collection.database;
   *   
   *   // You can call Database methods on it
   *   const dbName = collection.database.getName();        // Returns: 'myDatabase'
   *   const dbPath = await collection.database.getPath();  // Returns: '/path/to/db'
   *   const count = await collection.database.getCount();  // Gets document count
   * 
   * @property
   */
  readonly database!: Database;

  /**
   * fullName: Returns the fully qualified name of the collection.
   * Format: '<scope-name>.<collection-name>'
   * 
   * This is useful for logging, debugging, and unique identification of collections.
   * 
   * Example:
   *   const collection = await database.createCollection('users', 'production');
   *   console.log(collection.fullName());
   *   // Output: 'production.users'
   * 
   *   const defaultCol = await database.defaultCollection();
   *   console.log(defaultCol.fullName());
   *   // Output: '_default._default'
   * 
   * @property
   */
  // fullName = () => `${this.scope.name}.${this.name}`;

  async fullName(): Promise<string> {
    try {
    const result = await this._engine.collection_GetFullName({
      name: this.scope.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name
    })
    return result.fullName;
  } catch (error) {
    throw new Error(
      `Failed to get fullName for collection '${this.name}': ${error.message}`
    );
  }
  }

  /**
   * name: The collection's name.
   * 
   * This property is immutable and cannot be changed after construction.
   * Attempting to modify it will throw a TypeError at runtime.
   * 
   * Common naming conventions:
   * - Lowercase: 'users', 'products', 'orders'
   * - CamelCase: 'userProfiles', 'orderHistory'
   * - Underscore: 'user_profiles', 'order_history'
   * - Default collection: '_default'
   * 
   * Example:
   *   const collection = await database.createCollection('users');
   *   console.log(collection.name); // Output: 'users'
   * 
   * @property
   */
  readonly name!: string;

  /**
   * scope: Reference to the Scope object this collection belongs to.
   * 
   * This property is immutable and cannot be changed after construction.
   * Attempting to modify it will throw a TypeError at runtime.
   * 
   * Scopes are namespaces for organizing collections. They allow you to group
   * related collections together (e.g., 'production' scope vs 'test' scope).
   * 
   * Example:
   *   console.log(collection.scope.name); // Output: 'myScope'
   *   console.log(collection.scope.database.getName()); // Output: 'myDatabase'
   * 
   * Default scope name: '_default'
   * 
   * @property
   */
  readonly scope!: Scope;

  /**
   * ==================
   * CHANGE LISTENERS
   * ==================
   */
  
  /**
   * addChangeListener: Registers a listener for changes to ANY document in this collection.
   * 
   * IMPORTANT: Only ONE collection-wide change listener is allowed per collection instance.
   * If you call this method twice, it will throw an error.
   * 
   * Use Cases:
   * - Real-time updates to UI when data changes
   * - Triggering synchronization or background tasks
   * - Logging and auditing changes
   * 
   * Example usage:
   * ```typescript
   * const collection = await database.createCollection('users');
   * 
   * // Add listener
   * const token = await collection.addChangeListener((data) => {
   *   console.log('Collection changed!');
   *   console.log('Changed document IDs:', data.documentIDs);
   *   // CRITICAL: It's documentIDs (capital IDs), not documentIds!
   *   // data.documentIDs might be: ['user-123', 'user-456']
   *   
   *   // Access collection (data.collection is available)
   *   console.log('Collection name:', data.collection.name);
   *   
   *   // Access database via collection (NO direct data.database property!)
   *   console.log('Database:', data.collection.database.getName());
   *   
   *   // Refresh UI or update state
   *   refreshUserList();
   * });
   * 
   * // Later, remove the listener when done
   * await collection.removeChangeListener(token);
   * ```
   * 
   * VERIFIED Callback Data Format (see core-types.ts CollectionChange):
   * {
   *   collection: Collection,      // Reference to this collection
   *   documentIDs: string[]        // Array of changed doc IDs (NOTE: Capital IDs!)
   * }
   * 
   * IMPORTANT: There is NO 'database' property! Access it via data.collection.database
   * 
   * @param listener - Callback function to be invoked when the collection changes
   * @returns Promise<string> - A token that can be used to remove the listener later
   * @throws Error if a listener is already registered for this collection
   * 
   * @function
   */
  async addChangeListener(listener: CollectionChangeListener): Promise<ListenerToken> {
    this._changeListener = listener;
    const uuidToken: string = this.uuid();

    if (!this._didStartListener) {
      await this._engine.collection_AddChangeListener(
        {
          name: this.scope.database.getUniqueName(),
          scopeName: this.scope.name,
          collectionName: this.name,
          changeListenerToken: uuidToken,
        },
        (data, err) => {
          if (err) {
            throw err;
          }
          this.notifyChangeListeners(data);
        }
      );
      this._didStartListener = true;


      const cblListenerToken = new ListenerToken(uuidToken, async () => {
        
        // calling the remove listener native method 
        await this._engine.listenerToken_Remove({
          changeListenerToken: uuidToken
        })

        this._cblListenerTokensByUuid.delete(uuidToken);
        this._didStartListener = false;

      });

      this._cblListenerTokensByUuid.set(uuidToken, cblListenerToken);

      return cblListenerToken;
    } else {
      throw new Error('Listener already started');
    }
  }

  /**
   * addDocumentChangeListener: Registers a listener for changes to a SPECIFIC document.
   * 
   * Unlike addChangeListener (which listens to all documents), this method allows
   * fine-grained listening to individual documents. You can have multiple document
   * listeners (one per document ID) on the same collection.
   * 
   * Use Cases:
   * - Monitoring a user's profile for real-time updates
   * - Watching a shopping cart document for changes
   * - Tracking status updates for a specific order
   * 
   * Example usage:
   * ```typescript
   * const collection = await database.createCollection('users');
   * 
   * // Listen to specific user document
   * const token = await collection.addDocumentChangeListener(
   *   'user-123',
   *   (data) => {
   *     console.log(`Document ${data.documentId} changed!`);
   *     // data.documentId will be: 'user-123'
   *     
   *     // Fetch the updated document
   *     const updatedDoc = await collection.document(data.documentId);
   *     console.log('New data:', updatedDoc.getData());
   *   }
   * );
   * 
   * // You can add listeners to multiple documents
   * const token2 = await collection.addDocumentChangeListener('user-456', ...);
   * 
   * // Remove listener when done
   * await collection.removeDocumentChangeListener(token);
   * ```
   * 
   * VERIFIED Callback Data Format (see core-types.ts DocumentChange):
   * {
   *   documentId: string,       // ID of the document that changed (lowercase 'Id')
   *   collection: Collection,   // Reference to this collection
   *   database: Database        // Reference to the database (YES, this HAS database!)
   * }
   * 
   * @param documentId - The ID of the document to monitor
   * @param listener - Callback function invoked when the document changes
   * @returns Promise<string> - A token that can be used to remove the listener later
   * @throws Error if a listener is already registered for this document
   * 
   * @function
   */
  async addDocumentChangeListener(
    documentId: string,
    listener: DocumentChangeListener
  ): Promise<ListenerToken> {
    if (this._documentChangeListener.has(documentId)) {
      throw new Error(`Listener for document ${documentId} already started`);
    }

    const token = this.uuid();
    await this._engine.collection_AddDocumentChangeListener(
      {
        name: this.scope.database.getUniqueName(),
        scopeName: this.scope.name,
        collectionName: this.name,
        changeListenerToken: token,
        documentId: documentId,
      },
      (data, err) => {
        if (err) {
          throw err;
        }
        this.notifyDocumentChangeListeners(data);
      }
    );

    this._documentChangeListener.set(documentId, listener);
    this._docListenerTokens.set(token, documentId);

    // Create ListenerToken wrapper
    const cblListenerToken = new ListenerToken(token, async () => {
      // calling the remove listener native method
      await this._engine.listenerToken_Remove({
        changeListenerToken: token
      });
      
      this._cblDocumentListenerTokensByUuid.delete(token);
      
      // Cleanup internal state
      const docId = this._docListenerTokens.get(token);
      if (docId) {
        this._documentChangeListener.delete(docId);
        this._docListenerTokens.delete(token);
      }
    });

    this._cblDocumentListenerTokensByUuid.set(token, cblListenerToken);
    
    return cblListenerToken;
  }
  

  /**
   * ==================
   * DOCUMENT OPERATIONS
   * ==================
   */
  
  /**
   * count: Returns the total number of documents in this collection.
   * 
   * This is a fast operation that returns the document count without loading all documents.
   * 
   * Example usage:
   * ```typescript
   * const collection = await database.createCollection('users');
   * 
   * // Add some documents
   * await collection.save(new MutableDocument('user-1'));
   * await collection.save(new MutableDocument('user-2'));
   * await collection.save(new MutableDocument('user-3'));
   * 
   * // Get count
   * const result = await collection.count();
   * console.log(`Total users: ${result.count}`);
   * // Output: Total users: 3
   * ```
   * 
   * Use Cases:
   * - Displaying total record counts in UI
   * - Checking if collection is empty before operations
   * - Progress indicators and pagination calculations
   * 
   * @returns Promise<{ count: number }> - Object containing the document count
   * @throws Error if the collection is deleted or the database is closed
   * 
   * @function
   */
  count(): Promise<{ count: number }> {
    return this._engine.collection_GetCount({
      name: this.scope.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name,
    });
  }

  /**
   * createIndex: Creates an index on the collection to improve query performance.
   * 
   * Indexes speed up queries but take up storage space and slow down writes slightly.
   * Create indexes on fields that you frequently query or sort by.
   * 
   * TYPES OF INDEXES:
   * - ValueIndex: For simple property queries and sorting
   * - FullTextIndex: For full-text search on text fields
   * 
   * Example 1 - Value Index (single property):
   * ```typescript
   * import { IndexBuilder, ValueIndexItem } from 'cbl-reactnative';
   * 
   * const collection = await database.createCollection('users');
   * 
   * // CORRECT: Create index on email field using ValueIndexItem
   * const emailIndex = IndexBuilder.valueIndex(ValueIndexItem.property('email'));
   * await collection.createIndex('idx_user_email', emailIndex);
   * 
   * // Now queries on email will be faster
   * const query = database.createQuery(
   *   'SELECT * FROM users WHERE email = "john@example.com"'
   * );
   * ```
   * 
   * Example 2 - Value Index (multiple properties):
   * ```typescript
   * import { IndexBuilder, ValueIndexItem } from 'cbl-reactnative';
   * 
   * // CORRECT: Create composite index for queries on multiple fields
   * const nameAgeIndex = IndexBuilder.valueIndex(
   *   ValueIndexItem.property('name'),
   *   ValueIndexItem.property('age')
   * );
   * await collection.createIndex('idx_name_age', nameAgeIndex);
   * 
   * // Optimizes queries like:
   * // SELECT * FROM users WHERE name = "John" AND age = 30
   * ```
   * 
   * Example 3 - Full-Text Search Index:
   * ```typescript
   * import { IndexBuilder, FullTextIndexItem } from 'cbl-reactnative';
   * 
   * // CORRECT: Create full-text index for search
   * const descriptionIndex = IndexBuilder.fullTextIndex(
   *   FullTextIndexItem.property('description')
   * );
   * await collection.createIndex('idx_description_fts', descriptionIndex);
   * 
   * // Now you can do full-text searches
   * const query = database.createQuery(
   *   'SELECT * FROM products WHERE MATCH(idx_description_fts, "laptop computer")'
   * );
   * ```
   * 
   * BEST PRACTICES:
   * - Index fields you frequently query, filter, or sort by
   * - Don't over-index (each index uses storage and slows writes)
   * - Use descriptive names like 'idx_user_email' or 'idx_product_name'
   * - Consider composite indexes for multi-field queries
   * 
   * @param indexName - Unique name for the index (e.g., 'idx_user_email')
   * @param index - The AbstractIndex object (ValueIndex or FullTextIndex)
   * @returns Promise<void>
   * @throws Error if index already exists or database is closed
   *
   * @function
   */
  createIndex(indexName: string, index: AbstractIndex): Promise<void> {
    return this._engine.collection_CreateIndex({
      name: this.scope.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      indexName: indexName,
      index: index.toJson(),
    });
  }

  /**
   * deleteDocument: Deletes a document from the collection.
   * 
   * IMPORTANT DIFFERENCES FROM PURGE:
   * - deleteDocument: Marks document as deleted (tombstone), syncs deletion to other devices
   * - purge: Completely removes document without trace, doesn't sync deletion
   * 
   * Use deleteDocument when you want:
   * - The deletion to sync to other devices via replication
   * - To maintain history/audit trail of deleted documents
   * - Standard document removal in multi-device scenarios
   * 
   * CONCURRENCY CONTROL:
   * - null (default): Last Write Wins - always deletes
   * - ConcurrencyControl.FAIL_ON_CONFLICT: Fails if document was modified
   * 
   * Example 1 - Basic deletion:
   * ```typescript
   * const collection = await database.createCollection('users');
   * 
   * // Get the document
   * const doc = await collection.document('user-123');
   * 
   * if (doc) {
   *   // Delete it
   *   await collection.deleteDocument(doc);
   *   console.log('Document deleted');
   *   
   *   // Verify it's gone
   *   const checkDoc = await collection.document('user-123');
   *   console.log(checkDoc); // undefined
   * }
   * ```
   * 
   * Example 2 - Delete with conflict handling:
   * ```typescript
   * try {
   *   await collection.deleteDocument(doc, ConcurrencyControl.FAIL_ON_CONFLICT);
   *   console.log('Document deleted successfully');
   * } catch (error) {
   *   console.log('Document was modified, deletion failed');
   *   // Handle conflict - maybe reload and try again
   * }
   * ```
   * 
   * Example 3 - Delete multiple documents:
   * ```typescript
   * const docsToDelete = ['user-1', 'user-2', 'user-3'];
   * 
   * for (const docId of docsToDelete) {
   *   const doc = await collection.document(docId);
   *   if (doc) {
   *     await collection.deleteDocument(doc);
   *   }
   * }
   * ```
   * 
   * @param document - The Document object to delete
   * @param concurrencyControl - Optional conflict resolution strategy
   * @returns Promise<void>
   * @throws Error if document doesn't exist, collection is deleted, or database is closed
   *
   * @function
   */
  deleteDocument(
    document: Document,
    concurrencyControl: ConcurrencyControl = null
  ): Promise<void> {
    const id = document.getId();
    return this._engine.collection_DeleteDocument({
      name: this.scope.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      docId: id,
      concurrencyControl: concurrencyControl,
    });
  }

  /**
   * ==================
   * INDEX OPERATIONS
   * ==================
   */
  
  /**
   * deleteIndex: Removes an index from the collection by name.
   * 
   * Indexes improve query performance but take up storage space. Delete them
   * if they're no longer needed.
   * 
   * Example usage:
   * ```typescript
   * // Remove an index that's no longer needed
   * await collection.deleteIndex('idx_user_email');
   * console.log('Index deleted');
   * 
   * // Verify it's gone
   * const indexes = await collection.indexes();
   * console.log('Remaining indexes:', indexes);
   * // Output: Remaining indexes: ['idx_user_name', 'idx_user_age']
   * ```
   * 
   * @param indexName - Name of the index to delete
   * @returns Promise<void>
   * @throws Error if the index doesn't exist or the database is closed
   *
   * @function
   */
  deleteIndex(indexName: string): Promise<void> {
    return this._engine.collection_DeleteIndex({
      name: this.scope.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      indexName: indexName,
    });
  }

  /**
   * document: Retrieves a document from the collection by its ID.
   *
   * This method returns a read-only Document object. To modify the document,
   * you'll need to create a new MutableDocument from it.
   * 
   * Example 1 - Basic retrieval:
   * ```typescript
   * const collection = await database.createCollection('users');
   * 
   * // Get document
   * const doc = await collection.document('user-123');
   * 
   * if (doc) {
   *   console.log('Document ID:', doc.getId());
   *   // Output: Document ID: user-123
   *   
   *   console.log('Data:', doc.getData());
   *   // Output: Data: { name: 'John Doe', email: 'john@example.com', age: 30 }
   *   
   *   console.log('Revision:', doc.getRevisionID());
   *   // Output: Revision: 2-abc123def456
   *   
   *   console.log('Sequence:', doc.getSequence());
   *   // Output: Sequence: 42
   * } else {
   *   console.log('Document not found');
   * }
   * ```
   * 
   * Example 2 - Accessing specific fields:
   * ```typescript
   * const doc = await collection.document('user-123');
   * 
   * // Access individual fields
   * const name = doc.getString('name');        // 'John Doe'
   * const age = doc.getInt('age');             // 30
   * const email = doc.getString('email');      // 'john@example.com'
   * const isActive = doc.getBoolean('active'); // true
   * 
   * // Access nested objects
   * const address = doc.getDictionary('address');
   * console.log(address); // { street: '123 Main St', city: 'NYC' }
   * 
   * // Access arrays
   * const tags = doc.getArray('tags');
   * console.log(tags); // ['admin', 'premium', 'verified']
   * ```
   * 
   * Example 3 - Updating a document:
   * ```typescript
   * // Get the document
   * const doc = await collection.document('user-123');
   * 
   * if (doc) {
   *   // Create mutable copy
   *   const mutableDoc = new MutableDocument(doc.getId(), doc.getData());
   *   
   *   // Modify
   *   mutableDoc.setString('email', 'newemail@example.com');
   *   
   *   // Save
   *   await collection.save(mutableDoc);
   * }
   * ```
   * 
   * @param id - The document ID to retrieve
   * @returns Promise<Document | undefined> - The Document object, or undefined if not found
   * @throws Error if the collection is deleted or the database is closed
   *
   * @function
   */
  async document(id: string): Promise<Document> {
    const docJson = await this._engine.collection_GetDocument({
      docId: id,
      name: this.scope.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name,
    });
    // @ts-expect-error - _id is used in getId()
    if (docJson && docJson._id) {
      // @ts-expect-error - _data is used in getData()
      const data = docJson._data;
      // @ts-expect-error - _sequence is used in getSequence()
      const sequence = docJson._sequence;
      // @ts-expect-error - _id is used in getId()
      const retId = docJson._id;
      // @ts-expect-error - _revId is used in getRevisionID()
      const revisionID = docJson._revId;
      return Promise.resolve(new Document(retId, sequence, revisionID, this, data));
    } else {
      return Promise.resolve(undefined);
    }
  }

  /**
   * getDocument: Alias for the document() method.
   * 
   * Retrieves an existing document by its ID. This method has identical behavior
   * to document(). Both are provided for API compatibility and developer preference.
   *
   * @param id - The document ID to retrieve
   * @returns Promise<Document | undefined> - The Document object, or undefined if not found
   * @throws Error if the collection is deleted or the database is closed
   *
   * @function
   */
  async getDocument(id: string): Promise<Document> {
    return this.document(id);
  }

  /**
   * ==================
   * DOCUMENT EXPIRATION
   * ==================
   */
  
  /**
   * getDocumentExpiration: Returns the expiration date for a document, if set.
   * 
   * Document expiration allows you to automatically delete documents after a
   * certain date/time. This is useful for temporary data, caching, or compliance
   * requirements.
   * 
   * Example usage:
   * ```typescript
   * const collection = await database.createCollection('sessions');
   * 
   * // Check if document has expiration
   * const expiration = await collection.getDocumentExpiration('session-123');
   * 
   * if (expiration) {
   *   console.log('Document expires at:', expiration);
   *   // Output: Document expires at: 2024-12-31T23:59:59.000Z
   *   
   *   const now = new Date();
   *   const timeLeft = expiration.getTime() - now.getTime();
   *   console.log(`Expires in ${Math.floor(timeLeft / 1000)} seconds`);
   * } else {
   *   console.log('Document has no expiration');
   * }
   * ```
   * 
   * @param id - The document ID to check
   * @returns Promise<Date | null> - The expiration date, or null if no expiration is set
   * @throws Error if the collection is deleted or the database is closed
   *
   * @function
   */
  async getDocumentExpiration(id: string): Promise<Date | null> {
    const date = await this._engine.collection_GetDocumentExpiration({
      docId: id,
      name: this.scope.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name,
    });
    if (!!date && date?.date) {
      return date.date;
    } else {
      return null;
    }
  }

  /**
   * ==================
   * UTILITY METHODS
   * ==================
   */
  
  /**
   * getEngine: Returns the underlying native engine interface.
   * 
   * This is an advanced method that provides access to the low-level bridge
   * between JavaScript and native code (Kotlin/Swift). Most developers won't
   * need to use this directly.
   * 
   * Use cases:
   * - Testing and debugging
   * - Custom native extensions
   * - Direct engine calls (advanced)
   * 
   * @returns ICoreEngine - The native engine interface
   *
   * @function
   */
  getEngine(): ICoreEngine {
    return this._engine;
  }

  /**
   * indexes: Returns an array of all index names in this collection.
   * 
   * Use this to see what indexes exist before creating new ones or to verify
   * that an index was created successfully.
   * 
   * Example usage:
   * ```typescript
   * import { IndexBuilder, ValueIndexItem } from 'cbl-reactnative';
   * 
   * const collection = await database.createCollection('users');
   * 
   * // Create some indexes (NOTE: Must use ValueIndexItem.property()!)
   * await collection.createIndex(
   *   'idx_email',
   *   IndexBuilder.valueIndex(ValueIndexItem.property('email'))
   * );
   * await collection.createIndex(
   *   'idx_name',
   *   IndexBuilder.valueIndex(ValueIndexItem.property('name'))
   * );
   * 
   * // Get all index names
   * const indexNames = await collection.indexes();
   * console.log('Indexes:', indexNames);
   * // Output: Indexes: ['idx_email', 'idx_name']
   * 
   * // Check if specific index exists
   * if (indexNames.includes('idx_email')) {
   *   console.log('Email index exists');
   * }
   * ```
   *
   * @returns Promise<string[]> - Array of index names
   * @throws Error if the collection is deleted or the database is closed
   * 
   * @function
   */
  async indexes(): Promise<string[]> {
    const indexes = await this._engine.collection_GetIndexes({
      name: this.scope.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name,
    });
    return indexes.indexes;
  }

  /**
   * ==================
   * PRIVATE HELPER METHODS
   * ==================
   */
  
  /**
   * notifyChangeListeners: Internal method that forwards collection change events
   * to the registered listener callback.
   * 
   * @param data - Change event data from the native layer
   * @private
   */
  private notifyChangeListeners(data: any) {
    this._changeListener(data);
  }

  /**
   * notifyDocumentChangeListeners: Internal method that forwards document-specific
   * change events to the appropriate registered listener callback.
   * 
   * @param data - Change event data containing documentId
   * @private
   */
  private notifyDocumentChangeListeners(data: any) {
    const documentId = data.documentId;
    const changeListener = this._documentChangeListener.get(documentId);
    changeListener({
      documentId: documentId,
      collection: this,
      database: this.database,
    });
  }

  /**
   * ==================
   * PURGE OPERATIONS
   * ==================
   */
  
  /**
   * purge: Permanently removes a document from the collection WITHOUT creating a tombstone.
   * 
   * CRITICAL DIFFERENCES FROM DELETE:
   * ┌─────────────────┬────────────────────┬─────────────────────┐
   * │                 │ deleteDocument()   │ purge()             │
   * ├─────────────────┼────────────────────┼─────────────────────┤
   * │ Creates         │ Tombstone (marker) │ Complete removal    │
   * │ Syncs deletion  │ Yes                │ No                  │
   * │ Reversible      │ Via sync           │ No (permanent)      │
   * │ Use case        │ Normal deletions   │ Data cleanup        │
   * └─────────────────┴────────────────────┴─────────────────────┘
   * 
   * Use purge when:
   * - You need to completely remove sensitive data
   * - The deletion should NOT sync to other devices
   * - You're cleaning up old/test data permanently
   * - You want to free up space (tombstones take space too)
   * 
   * WARNING: Purging cannot be undone and will NOT sync to other devices!
   * 
   * Example 1 - Purge by document object:
   * ```typescript
   * const collection = await database.createCollection('users');
   * 
   * // Get document
   * const doc = await collection.document('test-user-123');
   * 
   * if (doc) {
   *   // Permanently remove it
   *   await collection.purge(doc);
   *   console.log('Document purged permanently');
   *   
   *   // It's really gone
   *   const check = await collection.document('test-user-123');
   *   console.log(check); // undefined
   * }
   * ```
   * 
   * Example 2 - Purge sensitive data:
   * ```typescript
   * // Remove sensitive user data completely
   * const sensitiveDoc = await collection.document('sensitive-123');
   * if (sensitiveDoc) {
   *   await collection.purge(sensitiveDoc);
   *   // Data is gone forever, no trace left
   * }
   * ```
   * 
   * @param document - The Document object to purge
   * @returns Promise<void>
   * @throws Error if document doesn't exist, collection is deleted, or database is closed
   *
   * @function
   */
  purge(document: Document) {
    return this._engine.collection_PurgeDocument({
      name: this.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      docId: document.getId(),
    });
  }

  /**
   * purgeById: Permanently removes a document by ID without creating a tombstone.
   * 
   * Convenience method that purges a document by ID without needing to fetch
   * the Document object first. Has the same behavior as purge().
   * 
   * Example usage:
   * ```typescript
   * const collection = await database.createCollection('users');
   * 
   * // Purge directly by ID (no need to fetch document first)
   * await collection.purgeById('test-user-123');
   * console.log('Document purged by ID');
   * 
   * // Purge multiple documents
   * const idsToRemove = ['temp-1', 'temp-2', 'temp-3'];
   * for (const id of idsToRemove) {
   *   await collection.purgeById(id);
   * }
   * ```
   * 
   * @param documentId - The ID of the document to purge
   * @returns Promise<void>
   * @throws Error if document doesn't exist, collection is deleted, or database is closed
   *
   * @function
   */
  purgeById(documentId: string) {
    return this._engine.collection_PurgeDocument({
      name: this.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      docId: documentId,
    });
  }

  /**
   * ==================
   * LISTENER REMOVAL
   * ==================
   */
  
  /**
   * removeChangeListener: Stops and removes the collection-wide change listener.
   * 
   * Always clean up listeners when you're done with them to prevent memory leaks
   * and unnecessary processing.
   * 
   * Example usage:
   * ```typescript
   * // Add listener
   * const token = await collection.addChangeListener((data) => {
   *   console.log('Changes:', data.documentIDs);  // NOTE: Capital IDs!
   * });
   * 
   * // Later, when component unmounts or you're done listening
   * await collection.removeChangeListener(token);
   * console.log('Listener removed');
   * ```
   * 
   * React example:
   * ```typescript
   * useEffect(() => {
   *   let listenerToken: string;
   *   
   *   const setupListener = async () => {
   *     listenerToken = await collection.addChangeListener((data) => {
   *       // Update state - NOTE: It's documentIDs (capital IDs)!
   *       setDocuments(data.documentIDs);
   *     });
   *   };
   *   
   *   setupListener();
   *   
   *   // Cleanup on unmount
   *   return () => {
   *     if (listenerToken) {
   *       collection.removeChangeListener(listenerToken);
   *     }
   *   };
   * }, []);
   * ```
   * 
   * @param token - The token returned by addChangeListener()
   * @returns Promise<void>
   * @throws Error if the collection is deleted or the database is closed
   *
   * @function
   */
  async removeChangeListener(token: string | ListenerToken) {

    const uuidToken: string = typeof token === 'string' 
    ? token  // Already a UUID string
    : token.getUuidToken(); // Extract from CBL ListenerToken


    // Find the CBL ListenerToken object
    const cblListenerToken = this._cblListenerTokensByUuid.get(uuidToken);

    if(cblListenerToken){
      await cblListenerToken.remove();
    }
    else {
      // Fallback: call generic bridge method directly
      await this._engine.listenerToken_Remove({
        changeListenerToken: uuidToken,
      });
      this._didStartListener = false;
    }


  }
  
  /**
   * removeDocumentChangeListener: Stops and removes a document-specific change listener.
   * 
   * Clean up document listeners when you're done monitoring specific documents.
   * 
   * Example usage:
   * ```typescript
   * // Add listener for specific document
   * const token = await collection.addDocumentChangeListener(
   *   'user-123',
   *   (data) => {
   *     console.log(`User ${data.documentId} changed`);
   *   }
   * );
   * 
   * // Remove listener when done
   * await collection.removeDocumentChangeListener(token);
   * console.log('Document listener removed');
   * ```
   * 
   * @param token - The token returned by addDocumentChangeListener()
   * @returns Promise<void>
   * @throws Error if the collection is deleted or the database is closed
   *
   * @function
   */
  async removeDocumentChangeListener(token: string | ListenerToken) {
    const uuidToken: string = typeof token === 'string' 
      ? token 
      : token.getUuidToken();

    // Find the CBL ListenerToken object
    const cblListenerToken = this._cblDocumentListenerTokensByUuid.get(uuidToken);

    if (cblListenerToken) {
      await cblListenerToken.remove();
    } else {
      // Fallback: call generic bridge method directly
      await this._engine.listenerToken_Remove({
        changeListenerToken: uuidToken
      });
      
      // Cleanup internal state
      const documentId = this._docListenerTokens.get(uuidToken);
      if (documentId) {
        this._documentChangeListener.delete(documentId);
        this._docListenerTokens.delete(uuidToken);
      }
    }

  }

  /**
   * save: Saves a document into the collection.
   * 
   * This is the primary method for creating and updating documents in Couchbase Lite.
   * It handles both new documents and updates to existing documents.
   * 
   * CONCURRENCY CONTROL:
   * -------------------
   * The optional concurrencyControl parameter determines behavior when conflicts occur:
   * 
   * - null (default): Last Write Wins - always overwrites
   * - ConcurrencyControl.FAIL_ON_CONFLICT: Throws error if document was modified
   * 
   * Example 1 - Save a new document:
   * ```typescript
   * const collection = await database.createCollection('users');
   * 
   * // Create a new document
   * const doc = new MutableDocument('user-123');
   * doc.setData({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   age: 30,
   *   role: 'admin',
   *   createdAt: new Date().toISOString()
   * });
   * 
   * // Save to collection
   * await collection.save(doc);
   * console.log('Document saved with ID:', doc.getId());
   * // Output: Document saved with ID: user-123
   * ```
   * 
   * Example 2 - Update an existing document:
   * ```typescript
   * // Retrieve document
   * const doc = await collection.document('user-123');
   * 
   * // Convert to mutable and update
   * const mutableDoc = new MutableDocument(doc.getId(), doc.getData());
   * mutableDoc.setString('email', 'newemail@example.com');
   * 
   * // Save changes
   * await collection.save(mutableDoc);
   * ```
   * 
   * Example 3 - Conflict handling:
   * ```typescript
   * try {
   *   await collection.save(doc, ConcurrencyControl.FAIL_ON_CONFLICT);
   * } catch (error) {
   *   console.log('Document was modified by another process');
   *   // Handle conflict - maybe merge changes or retry
   * }
   * ```
   * 
   * Example 4 - Document with blobs (images, files):
   * ```typescript
   * const doc = new MutableDocument('user-123');
   * doc.setString('name', 'John Doe');
   * 
   * // Add an image blob
   * const imageData = await readImageFile('profile.jpg');
   * const blob = new Blob('image/jpeg', imageData);
   * doc.setBlob('profilePicture', blob);
   * 
   * await collection.save(doc);
   * ```
   * 
   * IMPORTANT NOTES:
   * - After saving, the document object is updated with new _id, _revId, and _sequence
   * - The document is automatically associated with this collection
   * - If no ID is provided, a UUID will be automatically generated
   * 
   * @param document - The MutableDocument to save
   * @param concurrencyControl - Optional conflict resolution strategy (default: null/last write wins)
   * @returns Promise<void>
   * @throws Error if the collection is deleted, database is closed, or conflict occurs with FAIL_ON_CONFLICT
   * 
   * @function
   */
  async save(
    document: MutableDocument,
    concurrencyControl: ConcurrencyControl = null
  ): Promise<void> {
    const blobString = document.blobsToJsonString();
    const documentString = document.toJsonString();
    const ret = await this._engine.collection_Save({
      id: document.getId(),
      document: documentString,
      blobs: blobString,
      concurrencyControl: concurrencyControl,
      name: this.scope.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name,
    });

    document.setId(ret._id);
    document.setRevisionID(ret._revId);
    document.setSequence(ret._sequence);
    document.setCollection(this);
  }

  /**
   * setDocumentExpiration: Sets an expiration date for a document.
   * 
   * Documents with an expiration date will be automatically deleted when the
   * expiration time is reached. This is useful for:
   * - Session tokens that should expire
   * - Temporary cache data
   * - Time-limited offers or content
   * - Compliance with data retention policies
   * 
   * Pass null to remove an existing expiration.
   * 
   * Example 1 - Set expiration for a session:
   * ```typescript
   * const collection = await database.createCollection('sessions');
   * 
   * // Create a session document
   * const session = new MutableDocument('session-123');
   * session.setData({ userId: 'user-456', token: 'abc123' });
   * await collection.save(session);
   * 
   * // Set to expire in 24 hours
   * const expirationDate = new Date();
   * expirationDate.setHours(expirationDate.getHours() + 24);
   * await collection.setDocumentExpiration('session-123', expirationDate);
   * 
   * console.log('Session will expire at:', expirationDate);
   * ```
   * 
   * Example 2 - Remove expiration:
   * ```typescript
   * // Remove expiration (document won't auto-delete)
   * await collection.setDocumentExpiration('session-123', null);
   * console.log('Expiration removed');
   * ```
   * 
   * Example 3 - Short-lived cache (1 hour):
   * ```typescript
   * const cache = new MutableDocument('cache-data');
   * cache.setData({ data: 'temporary', timestamp: Date.now() });
   * await collection.save(cache);
   * 
   * // Expire in 1 hour
   * const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
   * await collection.setDocumentExpiration('cache-data', oneHourLater);
   * ```
   * 
   * IMPORTANT NOTES:
   * - Expiration is checked periodically, not immediately at the exact time
   * - The document will be deleted as a purge (no tombstone, no sync)
   * - Set expiration before or after saving the document
   * 
   * @param id - The document ID
   * @param expiration - The Date when document should expire, or null to remove expiration
   * @returns Promise<void>
   * @throws Error if the document doesn't exist or the database is closed
   *
   * @function
   */
  async setDocumentExpiration(
    id: string,
    expiration: Date | null
  ): Promise<void> {
    await this._engine.collection_SetDocumentExpiration({
      docId: id,
      name: this.database.getUniqueName(),
      scopeName: this.scope.name,
      collectionName: this.name,
      expiration: expiration,
    });
  }

  /**
   * toJson: Converts the collection to a JSON-serializable object.
   * 
   * This method is primarily used internally for serialization when passing
   * collection data between JavaScript and native layers. It returns metadata
   * about the collection, not the documents within it.
   * 
   * Example usage:
   * ```typescript
   * const collection = await database.createCollection('users', 'production');
   * 
   * const jsonData = collection.toJson();
   * console.log(jsonData);
   * // Output:
   * // {
   * //   name: 'users',
   * //   scopeName: 'production',
   * //   databaseName: 'myDatabase_abc123'
   * // }
   * ```
   * 
   * @returns CollectionJson - Object with collection metadata
   *
   * @function
   */
  toJson(): CollectionJson {
    return {
      name: this.name,
      scopeName: this.scope.name,
      databaseName: this.database.getUniqueName(),
    };
  }

  /**
   * uuid: Generates a unique identifier string.
   * 
   * This is a private helper method used internally to generate unique tokens
   * for change listeners. It delegates to the native engine's UUID generator.
   * 
   * @returns string - A unique UUID string
   * @private
   */
  private uuid(): string {
    return this._engine.getUUID();
  }
}
// End of Collection class
