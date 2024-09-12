import { EmitterSubscription } from 'react-native';
import { CollectionChangeListenerArgs, ICoreEngine, ListenerCallback, CollectionArgs, CollectionCreateIndexArgs, CollectionDeleteDocumentArgs, CollectionDeleteIndexArgs, CollectionDocumentExpirationArgs, CollectionDocumentGetBlobContentArgs, CollectionDocumentSaveResult, CollectionGetDocumentArgs, CollectionPurgeDocumentArgs, CollectionSaveArgs, CollectionsResult, DatabaseArgs, DatabaseCopyArgs, DatabaseCreateIndexArgs, DatabaseDeleteDocumentArgs, DatabaseDeleteIndexArgs, DatabaseEncryptionKeyArgs, DatabaseExistsArgs, DatabaseGetDocumentArgs, DatabaseOpenArgs, DatabasePerformMaintenanceArgs, DatabasePurgeDocumentArgs, DatabaseSaveArgs, DatabaseSetFileLoggingConfigArgs, DatabaseSetLogLevelArgs, DocumentChangeListenerArgs, DocumentExpirationResult, DocumentGetBlobContentArgs, DocumentResult, QueryChangeListenerArgs, QueryExecuteArgs, QueryRemoveChangeListenerArgs, ReplicationChangeListenerArgs, ReplicatorArgs, ReplicatorCollectionArgs, ReplicatorCreateArgs, ReplicatorDocumentPendingArgs, ScopeArgs, ScopesResult } from './cblite-js/cblite/core-types';
import { Collection } from './cblite-js/cblite/src/collection';
import { Result } from './cblite-js/cblite/src/result';
import { ReplicatorStatus } from './cblite-js/cblite/src/replicator-status';
import { Scope } from './cblite-js/cblite/src/scope';
export declare class CblReactNativeEngine implements ICoreEngine {
    _defaultCollectionName: string;
    _defaultScopeName: string;
    _eventReplicatorStatusChange: string;
    _eventReplicatorDocumentChange: string;
    _eventCollectionChange: string;
    _eventCollectionDocumentChange: string;
    _eventQueryChange: string;
    private _isReplicatorStatusChangeEventSetup;
    private _replicatorChangeListeners;
    private _replicatorStatusChangeSubscription;
    private _replicatorDocumentChangeListeners;
    private _replicatorDocumentChangeStopListener;
    private _isReplicatorDocumentChangeEventSetup;
    private static readonly LINKING_ERROR;
    CblReactNative: any;
    private _eventEmitter;
    constructor();
    startListeningEvents: (event: string, callback: any) => EmitterSubscription;
    collection_AddChangeListener(args: CollectionChangeListenerArgs, lcb: ListenerCallback): Promise<void>;
    collection_AddDocumentChangeListener(args: DocumentChangeListenerArgs, lcb: ListenerCallback): Promise<void>;
    collection_CreateCollection(args: CollectionArgs): Promise<Collection>;
    collection_CreateIndex(args: CollectionCreateIndexArgs): Promise<void>;
    collection_DeleteCollection(args: CollectionArgs): Promise<void>;
    collection_DeleteDocument(args: CollectionDeleteDocumentArgs): Promise<void>;
    collection_DeleteIndex(args: CollectionDeleteIndexArgs): Promise<void>;
    collection_GetBlobContent(args: CollectionDocumentGetBlobContentArgs): Promise<{
        data: ArrayBuffer;
    }>;
    collection_GetCollection(args: CollectionArgs): Promise<Collection>;
    collection_GetCollections(args: ScopeArgs): Promise<CollectionsResult>;
    collection_GetCount(args: CollectionArgs): Promise<{
        count: number;
    }>;
    collection_GetDefault(args: DatabaseArgs): Promise<Collection>;
    collection_GetDocument(args: CollectionGetDocumentArgs): Promise<DocumentResult>;
    collection_GetDocumentExpiration(args: CollectionGetDocumentArgs): Promise<DocumentExpirationResult>;
    collection_GetIndexes(args: CollectionArgs): Promise<{
        indexes: string[];
    }>;
    collection_PurgeDocument(args: CollectionPurgeDocumentArgs): Promise<void>;
    collection_RemoveChangeListener(args: CollectionChangeListenerArgs): Promise<void>;
    collection_RemoveDocumentChangeListener(args: CollectionChangeListenerArgs): Promise<void>;
    collection_Save(args: CollectionSaveArgs): Promise<CollectionDocumentSaveResult>;
    collection_SetDocumentExpiration(args: CollectionDocumentExpirationArgs): Promise<void>;
    database_ChangeEncryptionKey(args: DatabaseEncryptionKeyArgs): Promise<void>;
    database_Close(args: DatabaseArgs): Promise<void>;
    database_Copy(args: DatabaseCopyArgs): Promise<void>;
    /**
     * @deprecated This function will be removed in future versions. Use collection_CreateIndex instead.
     */
    database_CreateIndex(args: DatabaseCreateIndexArgs): Promise<void>;
    database_Delete(args: DatabaseArgs): Promise<void>;
    database_DeleteWithPath(args: DatabaseExistsArgs): Promise<void>;
    /**
     * @deprecated This will be removed in future versions. Use collection_DeleteDocument instead.
     */
    database_DeleteDocument(args: DatabaseDeleteDocumentArgs): Promise<void>;
    /**
     * @deprecated This function will be removed in future versions. Use collection_DeleteIndex instead.
     */
    database_DeleteIndex(args: DatabaseDeleteIndexArgs): Promise<void>;
    database_Exists(args: DatabaseExistsArgs): Promise<{
        exists: boolean;
    }>;
    /**
     * @deprecated This will be removed in future versions. Use collection_GetCount instead.
     */
    database_GetCount(args: DatabaseArgs): Promise<{
        count: number;
    }>;
    /**
     * @deprecated This will be removed in future versions. Use collection_GetDocument instead.
     */
    database_GetDocument(args: DatabaseGetDocumentArgs): Promise<DocumentResult>;
    /**
     * @deprecated This function will be removed in future versions. Use collection_GetIndexes instead.
     */
    database_GetIndexes(args: DatabaseArgs): Promise<{
        indexes: string[];
    }>;
    database_GetPath(args: DatabaseArgs): Promise<{
        path: string;
    }>;
    database_Open(args: DatabaseOpenArgs): Promise<void>;
    database_PerformMaintenance(args: DatabasePerformMaintenanceArgs): Promise<void>;
    /**
     * @deprecated This will be removed in future versions. Use collection_PurgeDocument instead.
     */
    database_PurgeDocument(args: DatabasePurgeDocumentArgs): Promise<void>;
    /**
     * @deprecated This function will be removed in future versions. Use collection_Save instead.
     */
    database_Save(args: DatabaseSaveArgs): Promise<{
        _id: string;
    }>;
    database_SetFileLoggingConfig(args: DatabaseSetFileLoggingConfigArgs): Promise<void>;
    database_SetLogLevel(args: DatabaseSetLogLevelArgs): Promise<void>;
    /**
     * @deprecated This will be removed in future versions. Use collection_GetBlobContent instead.
     */
    document_GetBlobContent(args: DocumentGetBlobContentArgs): Promise<{
        data: ArrayBuffer;
    }>;
    file_GetDefaultPath(): Promise<{
        path: string;
    }>;
    file_GetFileNamesInDirectory(args: {
        path: string;
    }): Promise<{
        files: string[];
    }>;
    query_AddChangeListener(args: QueryChangeListenerArgs, lcb: ListenerCallback): Promise<void>;
    query_Execute(args: QueryExecuteArgs): Promise<Result>;
    query_Explain(args: QueryExecuteArgs): Promise<{
        data: string;
    }>;
    query_RemoveChangeListener(args: QueryRemoveChangeListenerArgs): Promise<void>;
    replicator_AddChangeListener(args: ReplicationChangeListenerArgs, lcb: ListenerCallback): Promise<void>;
    replicator_AddDocumentChangeListener(args: ReplicationChangeListenerArgs, lcb: ListenerCallback): Promise<void>;
    replicator_Cleanup(args: ReplicatorArgs): Promise<void>;
    replicator_Create(args: ReplicatorCreateArgs): Promise<ReplicatorArgs>;
    replicator_GetPendingDocumentIds(args: ReplicatorCollectionArgs): Promise<{
        pendingDocumentIds: string[];
    }>;
    replicator_GetStatus(args: ReplicatorArgs): Promise<ReplicatorStatus>;
    replicator_IsDocumentPending(args: ReplicatorDocumentPendingArgs): Promise<{
        isPending: boolean;
    }>;
    replicator_RemoveChangeListener(args: ReplicationChangeListenerArgs): Promise<void>;
    replicator_ResetCheckpoint(args: ReplicatorArgs): Promise<void>;
    replicator_Start(args: ReplicatorArgs): Promise<void>;
    replicator_Stop(args: ReplicatorArgs): Promise<void>;
    scope_GetDefault(args: DatabaseArgs): Promise<Scope>;
    scope_GetScope(args: ScopeArgs): Promise<Scope>;
    scope_GetScopes(args: DatabaseArgs): Promise<ScopesResult>;
    getUUID(): string;
}
//# sourceMappingURL=CblReactNativeEngine.d.ts.map