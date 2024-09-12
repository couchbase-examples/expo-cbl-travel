import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { EngineLocator } from "./cblite-js/cblite/src/engine-locator.mjs";
import uuid from 'react-native-uuid';
export class CblReactNativeEngine {
  _defaultCollectionName = '_default';
  _defaultScopeName = '_default';

  //event name mapping for the native side of the module
  _eventReplicatorStatusChange = 'replicatorStatusChange';
  _eventReplicatorDocumentChange = 'replicatorDocumentChange';
  _eventCollectionChange = 'collectionChange';
  _eventCollectionDocumentChange = 'collectionDocumentChange';
  _eventQueryChange = 'queryChange';

  //used to listen to replicator change events for both status and document changes
  _isReplicatorStatusChangeEventSetup = false;
  _replicatorChangeListeners = new Map();
  _replicatorStatusChangeSubscription = undefined;
  _replicatorDocumentChangeListeners = new Map();
  _replicatorDocumentChangeStopListener = undefined;
  _isReplicatorDocumentChangeEventSetup = false;
  static LINKING_ERROR = `The package 'cbl-reactnative' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
    ios: "- You have run 'pod install'\n",
    default: ''
  }) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
  CblReactNative = NativeModules.CblReactnative ? NativeModules.CblReactnative : new Proxy({}, {
    get() {
      throw new Error(CblReactNativeEngine.LINKING_ERROR);
    }
  });
  _eventEmitter = new NativeEventEmitter(this.CblReactNative);
  constructor() {
    EngineLocator.registerEngine(EngineLocator.key, this);
  }

  //startListeningEvents - used to listen to events from the native side of the module.  Implements Native change listeners for Couchbase Lite
  startListeningEvents = (event, callback) => {
    console.log(`::DEBUG:: Registering listener for event: ${event}`);
    return this._eventEmitter.addListener(event, data => {
      console.log(`Received event: ${event} with data: ${JSON.stringify(data)}`);
      callback(data);
    }, this);
  };
  collection_AddChangeListener(args, lcb) {
    return Promise.resolve(undefined);
  }
  collection_AddDocumentChangeListener(args, lcb) {
    return Promise.resolve(undefined);
  }
  collection_CreateCollection(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_CreateCollection(args.collectionName, args.name, args.scopeName).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  collection_CreateIndex(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_CreateIndex(args.indexName, args.index, args.collectionName, args.scopeName, args.name).then(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  collection_DeleteCollection(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_DeleteCollection(args.collectionName, args.name, args.scopeName).then(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  collection_DeleteDocument(args) {
    const concurrencyControl = args.concurrencyControl !== null ? args.concurrencyControl : -9999;
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_DeleteDocument(args.docId, args.name, args.scopeName, args.collectionName, concurrencyControl).then(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  collection_DeleteIndex(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_DeleteIndex(args.indexName, args.collectionName, args.scopeName, args.name).then(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  collection_GetBlobContent(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_GetBlobContent(args.key, args.documentId, args.name, args.scopeName, args.collectionName).then(resultsData => {
        resolve({
          data: new Uint8Array(resultsData.data).buffer
        });
      }, error => {
        reject(error);
      });
    });
  }
  collection_GetCollection(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_GetCollection(args.collectionName, args.name, args.scopeName).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  collection_GetCollections(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_GetCollections(args.name, args.scopeName).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  collection_GetCount(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_GetCount(args.collectionName, args.name, args.scopeName).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  collection_GetDefault(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_GetDefault(args.name).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  collection_GetDocument(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_GetDocument(args.docId, args.name, args.scopeName, args.collectionName).then(dr => {
        resolve(dr);
      }, error => {
        reject(error);
      });
    });
  }
  collection_GetDocumentExpiration(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_GetDocumentExpiration(args.docId, args.name, args.scopeName, args.collectionName).then(der => {
        resolve(der);
      }, error => {
        reject(error);
      });
    });
  }
  collection_GetIndexes(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_GetIndexes(args.collectionName, args.scopeName, args.name).then(items => {
        resolve(items);
      }, error => {
        reject(error);
      });
    });
  }
  collection_PurgeDocument(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_PurgeDocument(args.docId, args.name, args.scopeName, args.collectionName).then(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  collection_RemoveChangeListener(args) {
    return Promise.resolve(undefined);
  }
  collection_RemoveDocumentChangeListener(args) {
    return Promise.resolve(undefined);
  }
  collection_Save(args) {
    const concurrencyControl = args.concurrencyControl !== null ? args.concurrencyControl : -9999;
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_Save(args.document, args.id, args.name, args.scopeName, args.collectionName, concurrencyControl).then(resultsData => {
        resolve(resultsData);
      }, error => {
        reject(error);
      });
    });
  }
  collection_SetDocumentExpiration(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.collection_SetDocumentExpiration(args.expiration.toISOString(), args.docId, args.name, args.scopeName, args.collectionName).then(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  database_ChangeEncryptionKey(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.database_ChangeEncryptionKey(args.newKey, args.name).then(() => resolve(), error => {
        reject(error);
      });
    });
  }
  database_Close(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.database_Close(args.name).then(() => resolve(), error => {
        reject(error);
      });
    });
  }
  database_Copy(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.database_Copy(args.path, args.newName, args.config.directory, args.config.encryptionKey).then(() => resolve(), error => {
        reject(error);
      });
    });
  }

  /**
   * @deprecated This function will be removed in future versions. Use collection_CreateIndex instead.
   */
  database_CreateIndex(args) {
    const colArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      indexName: args.indexName,
      index: args.index
    };
    return this.collection_CreateIndex(colArgs);
  }
  database_Delete(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.database_Delete(args.name).then(() => resolve(), error => {
        reject(error);
      });
    });
  }
  database_DeleteWithPath(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.database_DeleteWithPath(args.directory, args.databaseName).then(() => resolve(), error => {
        reject(error);
      });
    });
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_DeleteDocument instead.
   */
  database_DeleteDocument(args) {
    const colArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      docId: args.docId,
      concurrencyControl: args.concurrencyControl
    };
    return this.collection_DeleteDocument(colArgs);
  }

  /**
   * @deprecated This function will be removed in future versions. Use collection_DeleteIndex instead.
   */
  database_DeleteIndex(args) {
    const colArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      indexName: args.indexName
    };
    return this.collection_DeleteIndex(colArgs);
  }
  database_Exists(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.database_Exists(args.databaseName, args.directory).then(result => resolve({
        exists: result
      }), error => {
        reject(error);
      });
    });
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_GetCount instead.
   */
  database_GetCount(args) {
    const colArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName
    };
    return this.collection_GetCount(colArgs);
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_GetDocument instead.
   */
  database_GetDocument(args) {
    const colArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      docId: args.docId
    };
    return this.collection_GetDocument(colArgs);
  }

  /**
   * @deprecated This function will be removed in future versions. Use collection_GetIndexes instead.
   */
  database_GetIndexes(args) {
    const colArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName
    };
    return this.collection_GetIndexes(colArgs);
  }
  database_GetPath(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.database_GetPath(args.name).then(result => resolve({
        path: result
      }), error => {
        reject(error);
      });
    });
  }
  database_Open(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.database_Open(args.name, args.config.directory, args.config.encryptionKey).then(() => resolve(), error => {
        reject(error);
      });
    });
  }
  database_PerformMaintenance(args) {
    const numValue = args.maintenanceType.valueOf();
    return new Promise((resolve, reject) => {
      this.CblReactNative.database_PerformMaintenance(numValue, args.name).then(() => resolve(), error => {
        reject(error);
      });
    });
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_PurgeDocument instead.
   */
  database_PurgeDocument(args) {
    const colArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      docId: args.docId
    };
    return this.collection_PurgeDocument(colArgs);
  }

  /**
   * @deprecated This function will be removed in future versions. Use collection_Save instead.
   */
  database_Save(args) {
    const colArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      id: args.id,
      document: args.document,
      concurrencyControl: args.concurrencyControl
    };
    return this.collection_Save(colArgs);
  }
  database_SetFileLoggingConfig(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.database_SetFileLoggingConfig(args.name, args.config.directory, args.config.level, args.config.maxSize, args.config.maxRotateCount, args.config.usePlaintext).then(() => resolve(), error => {
        reject(error);
      });
    });
  }
  database_SetLogLevel(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.database_SetLogLevel(args.domain, args.logLevel).then(() => resolve(), error => {
        reject(error);
      });
    });
  }

  /**
   * @deprecated This will be removed in future versions. Use collection_GetBlobContent instead.
   */
  document_GetBlobContent(args) {
    const colArgs = {
      name: args.name,
      collectionName: this._defaultCollectionName,
      scopeName: this._defaultScopeName,
      documentId: args.documentId,
      key: args.key
    };
    return this.collection_GetBlobContent(colArgs);
  }
  file_GetDefaultPath() {
    return new Promise((resolve, reject) => {
      this.CblReactNative.file_GetDefaultPath().then(result => {
        resolve({
          path: result
        });
      }, error => {
        reject(error);
      });
    });
  }
  file_GetFileNamesInDirectory(args) {
    return Promise.resolve({
      files: []
    });
  }
  query_AddChangeListener(args, lcb) {
    return Promise.resolve(undefined);
  }
  query_Execute(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.query_Execute(args.query, args.parameters, args.name).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  query_Explain(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.query_Explain(args.query, args.parameters, args.name).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  query_RemoveChangeListener(args) {
    return Promise.resolve(undefined);
  }
  replicator_AddChangeListener(args, lcb) {
    //need to track the listener callback for later use due to how React Native events work.  Events are global so we need to first find which callback to call, we could have multiple replicators registered
    //https://reactnative.dev/docs/native-modules-ios#sending-events-to-javascript
    if (this._replicatorChangeListeners.has(args.changeListenerToken)) {
      throw new Error('ERROR:  changeListenerToken already exists and is registered to listen to callbacks, cannot add a new one');
    }
    //if the event listener is not setup, then set up the listener.
    //Event listener only needs to be setup once for any replicators in memory
    if (!this._isReplicatorStatusChangeEventSetup) {
      this._replicatorStatusChangeSubscription = this.startListeningEvents(this._eventReplicatorStatusChange, results => {
        const token = results.token;
        const data = results.status;
        const error = results.error;
        if (token === undefined || token === null || token.length === 0) {
          console.log('::ERROR:: No token to resolve back to proper callback for Replicator Status Change');
          throw new Error('ERROR:  No token to resolve back to proper callback');
        }
        const callback = this._replicatorChangeListeners.get(token);
        if (callback !== undefined) {
          callback(data, error);
        } else {
          console.log(`Error: Could not found callback method for token: ${token}.`);
          throw new Error(`Error: Could not found callback method for token: ${token}.`);
        }
      });
      const count = this._eventEmitter.listenerCount('replicatorStatusChange');
      console.log(`::DEBUG::Replicator Status Change Listener count: ${count}`);
      this._isReplicatorStatusChangeEventSetup = true;
    }
    //add token to change listener map
    this._replicatorChangeListeners.set(args.changeListenerToken, lcb);
    return new Promise((resolve, reject) => {
      this.CblReactNative.replicator_AddChangeListener(args.changeListenerToken, args.replicatorId).then(() => {
        resolve();
      }, error => {
        this._replicatorChangeListeners.delete(args.changeListenerToken);
        //stop the event listening if there is an error and no other tokens are present, thus no need to listen to events
        if (this._replicatorChangeListeners.size === 0) {
          this._replicatorStatusChangeSubscription.remove();
          this._isReplicatorStatusChangeEventSetup = false;
        }
        reject(error);
      });
    });
  }
  replicator_AddDocumentChangeListener(args, lcb) {
    return Promise.resolve(undefined);
  }
  replicator_Cleanup(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.replicator_Cleanup(args.replicatorId).then(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  replicator_Create(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.replicator_Create(args.config).then(results => {
        resolve(results);
      }, error => {
        reject(error);
      });
    });
  }
  replicator_GetPendingDocumentIds(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.replicator_GetPendingDocumentIds(args.replicatorId, args.name, args.scopeName, args.collectionName).then(results => {
        resolve(results);
      }, error => {
        reject(error);
      });
    });
  }
  replicator_GetStatus(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.replicator_GetStatus(args.replicatorId).then(results => {
        resolve(results);
      }, error => {
        reject(error);
      });
    });
  }
  replicator_IsDocumentPending(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.replicator_IsDocumentPending(args.documentId, args.replicatorId, args.name, args.scopeName, args.collectionName).then(results => {
        resolve(results);
      }, error => {
        reject(error);
      });
    });
  }
  replicator_RemoveChangeListener(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.replicator_RemoveChangeListener(args.changeListenerToken, args.replicatorId).then(() => {
        //remove the listener callback from the map
        if (this._replicatorChangeListeners.has(args.changeListenerToken)) {
          this._replicatorChangeListeners.delete(args.changeListenerToken);
        }
        //remove listening to events if there are no more listeners registered
        if (this._replicatorChangeListeners.size === 0) {
          this._replicatorStatusChangeSubscription.remove();
          this._isReplicatorStatusChangeEventSetup = false;
        }
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  replicator_ResetCheckpoint(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.replicator_ResetCheckpoint(args.replicatorId).then(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  replicator_Start(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.replicator_Start(args.replicatorId).then(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  replicator_Stop(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.replicator_Stop(args.replicatorId).then(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
  scope_GetDefault(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.scope_GetDefault(args.name).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  scope_GetScope(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.scope_GetScope(args.scopeName, args.name).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  scope_GetScopes(args) {
    return new Promise((resolve, reject) => {
      this.CblReactNative.scope_GetScopes(args.name).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  getUUID() {
    return uuid.v4().toString();
  }
}
//# sourceMappingURL=CblReactNativeEngine.mjs.map