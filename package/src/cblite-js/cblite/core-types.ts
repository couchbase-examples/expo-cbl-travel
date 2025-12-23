import {
  AbstractIndex,
  Collection,
  ConcurrencyControl,
  Database,
  DatabaseConfiguration,
  DatabaseFileLoggingConfiguration,
  DocumentReplicationRepresentation,
  Dictionary,
  Document,
  MaintenanceType,
  Query,
  ReplicatorStatus,
  Result,
  ResultSet,
  Scope,
  CollectionJson,
} from './src';

import { LogSinksSetConsoleArgs, LogSinksSetFileArgs, LogSinksSetCustomArgs } from './src/log-sinks-types';


/**
 * Represents the data that is returned from a listener callback
 *
 * @interface
 */
export interface CallbackResultData {
  [key: string]: any;
}

/**
 * Represents any error messages that is returned from a listener callback
 *
 * @interface
 */
export interface CallbackResultError {
  message: string;
}

/**
 * Represents a Collection argument
 *
 * This interface is used to return the arguments
 * for getting a Collection from a Database
 *
 * @interface
 * @property {string} name - The unique name of the database
 * @property {string} scopeName - The unique name of the Scope
 * @property {string} collectionName - The unique name of the Collection
 */
export interface CollectionArgs {
  name: string;
  scopeName: string;
  collectionName: string;
}

/**
 * Represents a change in a collection.
 *
 * This interface is used to return a set of documents
 * that have changed from a change listener
 *
 * @interface
 * @property {string[]} documentIds - The unique identifier for each document
 */
export interface CollectionChange {
  documentIDs: string[];
  collection: Collection;
}

export type CollectionChangeListener = (change: CollectionChange) => void;

/**
 * Represents arguments in a change in a collection.
 *
 * This interface is used set up a collection change listener
 *
 * @interface
 */
export interface CollectionChangeListenerArgs extends CollectionArgs {
  changeListenerToken: string;
}

/**
 * Represents arguments for a creating an Index
 *
 * This interface is used to return the arguments
 * for creating an Index in a Collection
 *
 * @interface
 * @property {string} name - The unique name of the database
 * @property {string} scopeName - The unique name of the Scope
 * @property {string} collectionName - The unique name of the Collection
 * @property {string} indexName - The unique name of the database
 * @property {string} index - The abstract index to create
 */
export interface CollectionCreateIndexArgs extends CollectionArgs {
  indexName: string;
  index: AbstractIndex;
}

/**
 * Represents arguments for a deleting a document from a collection
 *
 * This interface is used to return the arguments
 * for deleting a document from a Collection
 *
 * @interface
 * @property {string} name - The unique name of the database
 * @property {string} scopeName - The unique name of the Scope
 * @property {string} collectionName - The unique name of the Collection
 * @property {string} docId - The unique id of the document
 */
export interface CollectionDeleteDocumentArgs extends CollectionArgs {
  docId: string;
  concurrencyControl: ConcurrencyControl;
}

/**
 * Represents arguments for a deleting an Index
 *
 * This interface is used to return the arguments
 * for deleting an Index in a Collection
 *
 * @interface
 * @property {string} name - The unique name of the database
 * @property {string} scopeName - The unique name of the Scope
 * @property {string} collectionName - The unique name of the Collection
 * @property {string} existsName - The unique name of the database
 * @property {string} directory - The full path to the database on the device
 */
export interface CollectionDeleteIndexArgs extends CollectionArgs {
  indexName: string;
}

export interface CollectionDocumentGetBlobContentArgs extends CollectionArgs {
  documentId: string;
  key: string;
}

export interface CollectionDocumentExpirationArgs extends CollectionArgs {
  docId: string;
  expiration: Date;
}

export interface CollectionDocumentSaveResult {
  _id: string;
  _revId: string;
  _sequence: number;
}

/**
 * Represents arguments for a getting a document from a collection
 *
 * This interface is used to return the arguments
 * for gettig a document from a Collection
 *
 * @interface
 * @property {string} name - The unique name of the database
 * @property {string} scopeName - The unique name of the Scope
 * @property {string} collectionName - The unique name of the Collection
 * @property {string} docId - The unique id of the document
 */
export interface CollectionGetDocumentArgs extends CollectionArgs {
  docId: string;
}

/**
 * Represents arguments for a purging a document from a collection
 *
 * This interface is used to return the arguments
 * for purging a document from a Collection
 *
 * @interface
 * @property {string} name - The unique name of the database
 * @property {string} scopeName - The unique name of the Scope
 * @property {string} collectionName - The unique name of the Collection
 * @property {string} docId - The unique id of the document
 */
export interface CollectionPurgeDocumentArgs extends CollectionArgs {
  docId: string;
}

export interface CollectionSaveArgs extends CollectionArgs {
  id: string;
  document: Dictionary;
  concurrencyControl: ConcurrencyControl | null;
}

export interface CollectionSaveStringArgs extends CollectionArgs {
  id: string;
  document: string;
  blobs: string;
  concurrencyControl: ConcurrencyControl | null;
}

export interface CollectionsResult {
  collections: Collection[];
}

/**
 * Represents a Database argument
 *
 * This interface is used to return the arguments
 * for getting a database
 *
 * @interface
 * @property {string} name - The unique name of the database
 */
export interface DatabaseArgs {
  name: string;
}

/**
 * Represents arguments for copying a Database
 *
 * This interface is used to return the arguments
 * for copying a Database
 *
 * @interface
 * @property {string} name - The unique name of the database
 */
export interface DatabaseCopyArgs extends DatabaseArgs {
  path: string;
  newName: string;
  config: DatabaseConfiguration;
}

/**
 * @deprecated This interface will be removed in future versions. Use CollectionCreateIndexArgs instead.
 */
export interface DatabaseCreateIndexArgs extends DatabaseArgs {
  indexName: string;
  index: AbstractIndex;
}

/**
 * @deprecated This interface will be removed in future versions. Use CollectionDeleteDocumentArgs instead.
 */
export interface DatabaseDeleteDocumentArgs extends DatabaseArgs {
  docId: string;
  concurrencyControl: ConcurrencyControl;
}

/**
 * @deprecated This interface will be removed in future versions. Use CollectionDeleteIndexArgs instead.
 */
export interface DatabaseDeleteIndexArgs extends DatabaseArgs {
  indexName: string;
}

/**
 * Represents arguments for a Database
 *
 * This interface is used to return the arguments
 * for checking if a Database exists
 *
 * @interface
 * @property {string} existsName - The unique name of the database
 * @property {string} directory - The full path to the database on the device
 */
export interface DatabaseExistsArgs {
  databaseName: string;
  directory: string;
}

/**
 * Represents arguments for changing the encryption key of a Database
 *
 *
 * @interface
 * @property {string} name - The unique name of the database
 * @property {string} newKey - the new encryption key - if null will remove the key
 */
export interface DatabaseEncryptionKeyArgs extends DatabaseArgs {
  newKey: string | null;
}

/**
 * @deprecated This interface will be removed in future versions. Use CollectionDeleteDocumentArgs instead.
 */
export interface DatabaseGetDocumentArgs extends DatabaseArgs {
  docId: string;
}

/**
 * Represents arguments for Opening a Database
 *
 * This interface is used to return the arguments
 * for opening a Database
 *
 * @interface
 * @property {string} name - The unique name of the database
 */
export interface DatabaseOpenArgs extends DatabaseArgs {
  config: DatabaseConfiguration;
}

/**
 * Represents arguments for performing maintenance on a Database
 *
 * @interface
 * @property {string} name - The unique name of the database
 * @property {string} maintenanceType - The type of maintenance to perform
 */
export interface DatabasePerformMaintenanceArgs extends DatabaseArgs {
  maintenanceType: MaintenanceType;
}

/**
 * @deprecated This interface will be removed in future versions. Use CollectionPurgeDocumentArgs instead.
 */
export interface DatabasePurgeDocumentArgs extends DatabaseArgs {
  docId: string;
}

/**
 * @deprecated This interface will be removed in future versions. Use ColllectionSaveArgs instead.
 */
export interface DatabaseSaveArgs extends DatabaseArgs {
  id: string;
  document: string;
  blobs: string;
  concurrencyControl: ConcurrencyControl | null;
}

export interface DatabaseSetFileLoggingConfigArgs extends DatabaseArgs {
  config: DatabaseFileLoggingConfiguration;
}

export interface DatabaseSetLogLevelArgs {
  domain: string;
  logLevel: number;
}

/**
 * Represents a change in a document in a given collection
 *
 * This interface is used to return single documentId that has changed
 *
 * @interface
 * @property {string[]} documentId - The unique identifier of the document
 * @property {Collection} collection - The collection the document is stored in
 * @property {Database} database - The database the collection and document are stored in
 */
export interface DocumentChange {
  documentId: string;
  collection: Collection;
  database: Database;
}

export type DocumentChangeListener = (change: DocumentChange) => void;

/**
 * Represents arguments in a change in a document in a collection.
 *
 * This interface is used set up a collection document change listener
 *
 * @interface
 */
export interface DocumentChangeListenerArgs extends CollectionArgs {
  documentId: string;
  changeListenerToken: string;
}

/**
 * @deprecated This interface will be removed in future versions. Use CollectionDocumentGetBlobContentArgs instead.
 */
export interface DocumentGetBlobContentArgs extends DatabaseArgs {
  documentId: string;
  key: string;
}

export interface DocumentResult {
  document: Document;
}

export interface DocumentExpirationResult {
  date: Date;
}

/**
 * Represents the interface for a listener callback
 *
 * @interface
 */
export type ListenerCallback = (data: CallbackResultData, error?: CallbackResultError) => void;

/**
 * Represents the interface for a listener handler that allows you to remove the listener
 *
 * @interface
 */
export interface ListenerHandle {
  remove: () => Promise<void>;
}

/**
 * Represents a change in a collection.
 *
 * This interface is used to return a set of documents
 * that have changed from a change listener
 *
 * @interface
 * @property {string[]} documentIds - The unique identifier for each document
 */
export interface QueryChange {
  error: string;
  query: Query;
  results: ResultSet;
}

export type QueryChangeListener = (change: QueryChange) => void;

/**
 * Represents arguments in a change in a document in a collection.
 *
 * This interface is used set up a collection document change listener
 *
 * @interface
 */
export interface QueryChangeListenerArgs extends QueryExecuteArgs {
  changeListenerToken: string;
}

/**
 * Represents arguments in a change in a collection.
 *
 * This interface is used set up a collection change listener
 *
 * @interface
 */
export interface QueryRemoveChangeListenerArgs extends DatabaseArgs {
  changeListenerToken: string;
}

export interface QueryExecuteArgs extends DatabaseArgs {
  query: string;
  parameters: Dictionary;
}

export interface ReplicatorArgs {
  replicatorId: string;
}

export interface ReplicatorCollectionArgs extends ReplicatorArgs, CollectionArgs {}

// implementation for Replicator Change Listener
export type ReplicatorChangeListener = (change: ReplicatorStatusChange) => void;

//implementation for Replicator Document Change Listener
export type ReplicatorDocumentChangeListener = (change: DocumentReplicationRepresentation) => void;

export interface ReplicatorCreateArgs {
  config: any;
}

/**
 * Represents arguments in a change in a collection.
 *
 * This interface is used set up a collection change listener
 *
 * @interface
 */
export interface ReplicationChangeListenerArgs extends ReplicatorArgs {
  changeListenerToken: string;
}

export interface ReplicatorDocumentPendingArgs extends ReplicatorArgs, CollectionArgs {
  documentId: string;
}

export interface ReplicatorStatusChange {
  status: ReplicatorStatus;
}

/**
 * Represents a Scope argument
 *
 * This interface is used to return the arguments
 * for getting a Scope from a Database
 *
 * @interface
 * @property {string} name - The unique name of the database
 * @property {string} scopeName - The unique name of the Scope
 */
export interface ScopeArgs {
  name: string;
  scopeName: string;
}

export interface ScopesResult {
  scopes: Scope[];
}

export interface ListenerAuthenticatorConfig {
  type: 'basic';
  data: { [key: string]: any };
}

/**
 * Common TLS identity options shared between both self-signed and imported certs.
 */
type CommonTlsConfig = {
  /**
   * Optional label to identify the certificate (used by Couchbase Lite).
   */
  label?: string;
};

/**
 * TLS Identity configuration for the Couchbase Lite plugin.
 *
 * Supports two modes:
 * - 'selfSigned': Generate a self-signed certificate on the device.
 * - 'imported': Load a user-provided certificate file (e.g., .p12).
 *   
 * @note 'imported' mode is not implemented on Android and will throw an error if used.
 */
export type TlsIdentityConfig =
  | ({
      /**
       * Mode indicating that a self-signed certificate should be created.
       */
      mode: 'selfSigned';

      /**
       * Optional expiration date for self-signed certificates in ISO format (e.g., "2026-12-31").
       * Ignored for imported certificates.
       */
      expiration?: string;

      /**
       * Certificate attributes required to generate a self-signed identity.
       * At minimum, `certAttrCommonName` must be provided.
       */
      attributes: {
        certAttrCommonName: string;
        [key: string]: string; // Other optional cert attributes (e.g., certAttrOrganization, certAttrCountry)
      };
    } & CommonTlsConfig)
  | ({
      /**
       * Mode indicating that a certificate should be imported from a file.
       */
      mode: 'imported';

      /**
       * Base64 of the certificate
       */
      certBase64: string;

      /**
       * Optional password for the certificate
       */
      password?: string;
    } & CommonTlsConfig);

/**
 * Represents arguments for creating a URL Endpoint Listener.
 *
 * @interface
 * @property {CollectionJson[]} collections - The list of collections to include in the listener.
 * @property {number} port - The port to listen on.
 * @property {string} [networkInterface] - Optional network interface to bind to.
 * @property {boolean} [disableTLS] - Optional flag to disable TLS.
 * @property {boolean} [enableDeltaSync] - Optional flag to enable delta sync.
 * @property {ListenerAuthenticatorConfig} [authenticatorConfig] - Optional authentication configuration for the listener.
 * @property {TlsIdentityConfig} [tlsIdentityConfig] - Optional TLS identity configuration for the listener.
 */
export interface URLEndpointListenerCreateArgs {
  collections: CollectionJson[];
  port: number;
  networkInterface?: string;
  disableTLS?: boolean;
  enableDeltaSync?: boolean;
  authenticatorConfig?: ListenerAuthenticatorConfig;
  tlsIdentityConfig?: TlsIdentityConfig;
}

/**
 * Represents arguments for starting or stopping a URL Endpoint Listener.
 *
 * @interface
 * @property {string} listenerId - The unique ID of the listener.
 */
export interface URLEndpointListenerArgs {
  listenerId: string;
}

export interface URLEndpointListenerTLSIdentityArgs {
  label: string;
}

/**
 * Represents the status of a URL Endpoint Listener.
 *
 * @interface
 * @property {number} connectionsCount - The total number of connections.
 * @property {number} activeConnectionCount - The number of active connections.
 */
export interface URLEndpointListenerStatus {
  connectionsCount: number;
  activeConnectionCount: number;
}

/**
 * Represents engine for the core functionality of the Couchbase Lite Plugin
 *
 * @interface
 */
export interface ICoreEngine {
  //********
  //**debug
  //********
  debugConsole: boolean;
  platform: string;

  //************
  // Collections
  //************
  collection_AddChangeListener(
    args: CollectionChangeListenerArgs,
    lcb: ListenerCallback
  ): Promise<void>;

  collection_AddDocumentChangeListener(
    args: DocumentChangeListenerArgs,
    lcb: ListenerCallback
  ): Promise<void>;

  collection_CreateCollection(args: CollectionArgs): Promise<Collection>;

  /**
   * Represents creating an Index
   *
   * This function is used to for creating an Index in a Collection
   *
   * @interface
   * @property {CollectionCreateIndexArgs} arguments for creating an Index
   */
  collection_CreateIndex(args: CollectionCreateIndexArgs): Promise<void>;

  collection_DeleteCollection(args: CollectionArgs): Promise<void>;

  /**
   * Delete a document from the collection. The default concurrency control, lastWriteWins,
   * will be used when there is conflict during delete. If the document doesn't exist in the
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
  collection_DeleteDocument(args: CollectionDeleteDocumentArgs): Promise<void>;

  /**
   * Represents deleting an Index
   *
   * This function is used to for deleting an Index in a Collection
   *
   * @interface
   * @property {CollectionDeleteIndexArgs} arguments for deleting an Index
   */
  collection_DeleteIndex(args: CollectionDeleteIndexArgs): Promise<void>;

  collection_GetCollection(args: CollectionArgs): Promise<Collection>;

  collection_GetCollections(args: ScopeArgs): Promise<CollectionsResult>;

  /**
   * Total number of documents in the collection.
   *
   * @function
   */
  collection_GetCount(args: CollectionArgs): Promise<{ count: number }>;


  /**
 * Get the fully qualified name of the collection.
 *
 * Returns the collection's full name in the format "scopeName.collectionName".
 *
 * Throws an error if the collection is deleted or the database is closed.
 *
 * @function
 */
  collection_GetFullName(args: CollectionArgs): Promise<{ fullName: string }>;

  collection_GetDefault(args: DatabaseArgs): Promise<Collection>;

  /**
   * Get an existing document by document ID.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  collection_GetDocument(args: CollectionGetDocumentArgs): Promise<DocumentResult>;

  /**
   * Get an existing document exipiration date by document ID.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  collection_GetDocumentExpiration(
    args: CollectionGetDocumentArgs
  ): Promise<DocumentExpirationResult>;

  collection_GetBlobContent(
    args: CollectionDocumentGetBlobContentArgs
  ): Promise<{ data: ArrayBuffer }>;

  /**
   * Represents getting an Index
   *
   * This function is used to for getting an Index in a Collection
   *
   * @interface
   * @property {CollectionArgs} arguments for getting an Index
   */
  collection_GetIndexes(args: CollectionArgs): Promise<{ indexes: string[] }>;

  /**
   * Purge a document by id from the collection. If the document doesn't exist in the
   * collection, an error will be thrown.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  collection_PurgeDocument(args: CollectionPurgeDocumentArgs): Promise<void>;

  collection_RemoveChangeListener(args: CollectionChangeListenerArgs): Promise<void>;

  //don't need documentId to remove change listener, so using CollectionChangeListenerArgs is perfectly legal
  collection_RemoveDocumentChangeListener(args: CollectionChangeListenerArgs): Promise<void>;


/**
 * Generic method to remove any listener by its UUID token.
 * This method works with all listener types (collection, query, replicator, etc.).
 * 
 * @param args Object containing the changeListenerToken (UUID string)
 * @returns Promise that resolves when the listener is removed
 */
  listenerToken_Remove(args: {changeListenerToken: string;}): Promise<void>;

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
  collection_Save(args: CollectionSaveStringArgs): Promise<CollectionDocumentSaveResult>;

  /**
   * Set an existing document expiration date by document ID.
   *
   * Throws an error if the collection is deleted or the database is closed.
   *
   * @function
   */
  collection_SetDocumentExpiration(args: CollectionDocumentExpirationArgs): Promise<void>;

  // ****************************
  // Database
  // ****************************

  database_ChangeEncryptionKey(args: DatabaseEncryptionKeyArgs): Promise<void>;

  database_Close(args: DatabaseArgs): Promise<void>;

  database_Copy(args: DatabaseCopyArgs): Promise<void>;

  /**
   * @deprecated This will be removed in future versions. Use collection_CreateIndex instead.
   */
  database_CreateIndex(args: DatabaseCreateIndexArgs): Promise<void>;

  database_Delete(args: DatabaseArgs): Promise<void>;

  database_DeleteWithPath(args: DatabaseExistsArgs): Promise<void>;

  /**
   * @deprecated This will be removed in future versions. Use Collection_DeleteDocument instead.
   */
  database_DeleteDocument(args: DatabaseDeleteDocumentArgs): Promise<void>;

  /**
   * @deprecated This will be removed in future versions. Use collection_DeleteIndex instead.
   */
  database_DeleteIndex(args: DatabaseDeleteIndexArgs): Promise<void>;

  database_Exists(args: DatabaseExistsArgs): Promise<{ exists: boolean }>;

  /**
   * @deprecated This will be removed in future versions. Use Collection_GetCount instead.
   */
  database_GetCount(args: DatabaseArgs): Promise<{ count: number }>;

  /**
   * @deprecated This will be removed in future versions. Use Collection_GetDocument instead.
   */
  database_GetDocument(args: DatabaseGetDocumentArgs): Promise<DocumentResult>;

  /**
   * @deprecated This will be removed in future versions. Use collection_GetIndexes instead.
   */
  database_GetIndexes(args: DatabaseArgs): Promise<{ indexes: string[] }>;

  database_GetPath(args: DatabaseArgs): Promise<{ path: string }>;

  database_Open(args: DatabaseOpenArgs): Promise<{ databaseUniqueName: string }>;

  database_PerformMaintenance(args: DatabasePerformMaintenanceArgs): Promise<void>;

  /**
   * @deprecated This will be removed in future versions. Use collection_PurgeDocument instead.
   */
  database_PurgeDocument(args: DatabasePurgeDocumentArgs): Promise<void>;

  /**
   * @deprecated This will be removed in future versions. Use collection_Save instead.
   */
  database_Save(args: DatabaseSaveArgs): Promise<{ _id: string }>;

  database_SetFileLoggingConfig(args: DatabaseSetFileLoggingConfigArgs): Promise<void>;

  database_SetLogLevel(args: DatabaseSetLogLevelArgs): Promise<void>;

  /**
   * @deprecated This will be removed in future versions. Use Collection_GetDocumentBlobContent instead.
   */
  document_GetBlobContent(args: DocumentGetBlobContentArgs): Promise<{ data: ArrayBuffer }>;

  /**
   * Represents getting a default path from the operating system to save a database
   *
   * This function is used to for returning the default path on the operating system to save a database
   *
   * @function
   */
  file_GetDefaultPath(): Promise<{ path: string }>;

  file_GetFileNamesInDirectory(args: { path: string }): Promise<{ files: string[] }>;

  //**********************
  // Query
  //**********************

  query_AddChangeListener(args: QueryChangeListenerArgs, lcb: ListenerCallback): Promise<void>;

  query_Execute(args: QueryExecuteArgs): Promise<Result>;

  query_Explain(args: QueryExecuteArgs): Promise<{ data: string }>;

  query_RemoveChangeListener(args: QueryRemoveChangeListenerArgs): Promise<void>;

  //***********
  // Replicator
  //***********
  replicator_AddChangeListener(
    args: ReplicationChangeListenerArgs,
    lcb: ListenerCallback
  ): Promise<void>;

  replicator_AddDocumentChangeListener(
    args: ReplicationChangeListenerArgs,
    lcb: ListenerCallback
  ): Promise<void>;

  replicator_Cleanup(args: ReplicatorArgs): Promise<void>;

  replicator_Create(args: any): Promise<ReplicatorArgs>;

  replicator_GetStatus(args: ReplicatorArgs): Promise<ReplicatorStatus>;

  replicator_GetPendingDocumentIds(
    args: ReplicatorCollectionArgs
  ): Promise<{ pendingDocumentIds: string[] }>;

  replicator_IsDocumentPending(
    args: ReplicatorDocumentPendingArgs
  ): Promise<{ isPending: boolean }>;

  replicator_Start(args: ReplicatorArgs): Promise<void>;

  replicator_Stop(args: ReplicatorArgs): Promise<void>;

  replicator_RemoveChangeListener(args: ReplicationChangeListenerArgs): Promise<void>;

  replicator_ResetCheckpoint(args: ReplicatorArgs): Promise<void>;

  //*******
  // Scopes
  //*******
  scope_GetDefault(args: DatabaseArgs): Promise<Scope>;

  scope_GetScope(args: ScopeArgs): Promise<Scope>;

  scope_GetScopes(args: DatabaseArgs): Promise<ScopesResult>;

  getUUID(): string;

  //********
  // URL Endpoint Listener
  //********

  /**
   * Creates a URL Endpoint Listener.
   *
   * @param args - The arguments for creating the listener.
   * @returns A promise that resolves with the listener ID.
   */
  URLEndpointListener_createListener(
    args: URLEndpointListenerCreateArgs
  ): Promise<{ listenerId: string }>;

  /**
   * Starts a URL Endpoint Listener.
   *
   * @param args - The arguments for starting the listener.
   * @returns A promise that resolves when the listener is started.
   */
  URLEndpointListener_startListener(args: URLEndpointListenerArgs): Promise<void>;

  /**
   * Stops a URL Endpoint Listener.
   *
   * @param args - The arguments for stopping the listener.
   * @returns A promise that resolves when the listener is stopped.
   */
  URLEndpointListener_stopListener(args: URLEndpointListenerArgs): Promise<void>;

  /**
   * Gets the status of a URL Endpoint Listener.
   *
   * @param args - The arguments for getting the listener status.
   * @returns A promise that resolves with the listener status.
   */
  URLEndpointListener_getStatus(args: URLEndpointListenerArgs): Promise<URLEndpointListenerStatus>;

  /**
   * Deletes the identity of a URL Endpoint Listener.
   *
   * @param args - The arguments for deleting the listener identity.
   * @returns A promise that resolves when the identity is deleted.
   */
  URLEndpointListener_deleteIdentity(args: URLEndpointListenerTLSIdentityArgs): Promise<void>;

  /**
   * Sets or disables the console log sink
   * Pass null values to disable
   */
  logsinks_SetConsole(args: LogSinksSetConsoleArgs): Promise<void>;
  
  /**
   * Sets or disables the file log sink
   * Pass null values to disable
   */
  logsinks_SetFile(args: LogSinksSetFileArgs): Promise<void>;
  
  /**
   * Sets or disables the custom log sink with callback
   * Pass null values to disable
   */
  logsinks_SetCustom(args: LogSinksSetCustomArgs): Promise<void>;
}