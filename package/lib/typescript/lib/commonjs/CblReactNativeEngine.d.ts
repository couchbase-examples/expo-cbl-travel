export const __esModule: boolean;
export class CblReactNativeEngine {
    static LINKING_ERROR: string;
    constructor(customEventEmitter: any);
    _defaultCollectionName: string;
    _defaultScopeName: string;
    debugConsole: boolean;
    platform: "ios" | "android" | "windows" | "macos" | "web";
    _eventReplicatorStatusChange: string;
    _eventReplicatorDocumentChange: string;
    _eventCollectionChange: string;
    _eventCollectionDocumentChange: string;
    _eventQueryChange: string;
    _replicatorChangeListeners: Map<any, any>;
    _emitterSubscriptions: Map<any, any>;
    _replicatorDocumentChangeListeners: Map<any, any>;
    _isReplicatorDocumentChangeEventSetup: boolean;
    _collectionChangeListeners: Map<any, any>;
    _collectionDocumentChangeListeners: Map<any, any>;
    _queryChangeListeners: Map<any, any>;
    customLogCallbacksMap: Map<any, any>;
    CblReactNative: any;
    _eventEmitter: any;
    debugLog(message: any): void;
    startListeningEvents: (event: any, callback: any) => any;
    collection_AddChangeListener(args: any, lcb: any): Promise<any>;
    collection_AddDocumentChangeListener(args: any, lcb: any): Promise<any>;
    collection_CreateCollection(args: any): Promise<any>;
    collection_CreateIndex(args: any): Promise<any>;
    collection_DeleteCollection(args: any): Promise<any>;
    collection_DeleteDocument(args: any): Promise<any>;
    collection_DeleteIndex(args: any): Promise<any>;
    collection_GetBlobContent(args: any): Promise<any>;
    collection_GetCollection(args: any): Promise<any>;
    collection_GetCollections(args: any): Promise<any>;
    collection_GetCount(args: any): Promise<any>;
    collection_GetFullName(args: any): Promise<any>;
    collection_GetDefault(args: any): Promise<any>;
    collection_GetDocument(args: any): Promise<any>;
    collection_GetDocumentExpiration(args: any): Promise<any>;
    collection_GetIndexes(args: any): Promise<any>;
    collection_PurgeDocument(args: any): Promise<any>;
    collection_RemoveChangeListener(args: any): Promise<any>;
    collection_RemoveDocumentChangeListener(args: any): Promise<any>;
    /**
     * Generic method to remove any listener by its UUID token.
     * Calls the native listenerToken_Remove bridge method.
     */
    listenerToken_Remove(args: any): any;
    collection_Save(args: any): Promise<any>;
    collection_SetDocumentExpiration(args: any): Promise<any>;
    database_ChangeEncryptionKey(args: any): Promise<any>;
    database_Close(args: any): Promise<any>;
    database_Copy(args: any): Promise<any>;
    /**
     * @deprecated This function will be removed in future versions. Use collection_CreateIndex instead.
     */
    database_CreateIndex(args: any): Promise<any>;
    database_Delete(args: any): Promise<any>;
    database_DeleteWithPath(args: any): Promise<any>;
    /**
     * @deprecated This will be removed in future versions. Use collection_DeleteDocument instead.
     */
    database_DeleteDocument(args: any): Promise<any>;
    /**
     * @deprecated This function will be removed in future versions. Use collection_DeleteIndex instead.
     */
    database_DeleteIndex(args: any): Promise<any>;
    database_Exists(args: any): Promise<any>;
    /**
     * @deprecated This will be removed in future versions. Use collection_GetCount instead.
     */
    database_GetCount(args: any): Promise<any>;
    /**
     * @deprecated This will be removed in future versions. Use collection_GetDocument instead.
     */
    database_GetDocument(args: any): Promise<any>;
    /**
     * @deprecated This function will be removed in future versions. Use collection_GetIndexes instead.
     */
    database_GetIndexes(args: any): Promise<any>;
    database_GetPath(args: any): Promise<any>;
    database_Open(args: any): Promise<any>;
    database_PerformMaintenance(args: any): Promise<any>;
    /**
     * @deprecated This will be removed in future versions. Use collection_PurgeDocument instead.
     */
    database_PurgeDocument(args: any): Promise<any>;
    /**
     * @deprecated This function will be removed in future versions. Use collection_Save instead.
     */
    database_Save(args: any): Promise<any>;
    database_SetFileLoggingConfig(args: any): Promise<any>;
    database_SetLogLevel(args: any): Promise<any>;
    /**
     * @deprecated This will be removed in future versions. Use collection_GetBlobContent instead.
     */
    document_GetBlobContent(args: any): Promise<any>;
    file_GetDefaultPath(): Promise<any>;
    file_GetFileNamesInDirectory(args: any): Promise<{
        files: any[];
    }>;
    query_AddChangeListener(args: any, lcb: any): Promise<any>;
    query_Execute(args: any): Promise<any>;
    query_Explain(args: any): Promise<any>;
    query_RemoveChangeListener(args: any): Promise<any>;
    replicator_AddChangeListener(args: any, lcb: any): Promise<any>;
    replicator_AddDocumentChangeListener(args: any, lcb: any): Promise<any>;
    replicator_Cleanup(args: any): Promise<any>;
    replicator_Create(args: any): Promise<any>;
    replicator_GetPendingDocumentIds(args: any): Promise<any>;
    replicator_GetStatus(args: any): Promise<any>;
    replicator_IsDocumentPending(args: any): Promise<any>;
    replicator_RemoveChangeListener(args: any): Promise<any>;
    replicator_ResetCheckpoint(args: any): Promise<any>;
    replicator_Start(args: any): Promise<any>;
    replicator_Stop(args: any): Promise<any>;
    scope_GetDefault(args: any): Promise<any>;
    scope_GetScope(args: any): Promise<any>;
    scope_GetScopes(args: any): Promise<any>;
    URLEndpointListener_createListener(args: any): Promise<never>;
    URLEndpointListener_startListener(args: any): Promise<never>;
    URLEndpointListener_stopListener(args: any): Promise<never>;
    URLEndpointListener_getStatus(args: any): Promise<never>;
    URLEndpointListener_deleteIdentity(args: any): Promise<never>;
    getUUID(): any;
    /**
     * Sets or disables the console log sink
     * @param args Arguments containing level and domains, or null to disable
     */
    logsinks_SetConsole(args: any): Promise<any>;
    /**
     * Sets or disables the file log sink
     * @param args Arguments containing level and config, or null to disable
     */
    logsinks_SetFile(args: any): Promise<any>;
    /**
     * Sets or disables the custom log sink
     * @param args Arguments containing level, domains, and token, or null to disable
     */
    logsinks_SetCustom(args: any): Promise<any>;
}
//# sourceMappingURL=CblReactNativeEngine.d.ts.map