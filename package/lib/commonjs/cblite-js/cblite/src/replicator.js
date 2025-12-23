"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Replicator = void 0;
var _engineLocator = require("./engine-locator.js");
var _replicatorStatus = require("./replicator-status.js");
var _replicatorProgress = require("./replicator-progress.js");
var _documentReplication = require("./document-replication.js");
var _listenerToken = require("./listener-token.js");
class Replicator {
  _replicatorId = undefined;
  _engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);

  //replication status change listener support

  _didStartStatusChangeListener = false;
  _replicatorListenerTokensByUuid = new Map();
  _replicatorDocListenerTokensByUuid = new Map();

  /**
   * Initializes a replicator with the given configuration
   *
   * @param config
   */
  constructor(replicatorId, config) {
    this._replicatorId = replicatorId;
    this._config = config.clone();
    this._documentChangeListener = new Map();
  }

  /**
   * Adds a replicator change listener for listening to status updates
   *
   * @function
   *
   */
  async addChangeListener(listener) {
    this._statusChangeListener = listener;
    const token = this._engine.getUUID();
    if (!this._didStartStatusChangeListener) {
      await this._engine.replicator_AddChangeListener({
        replicatorId: this._replicatorId,
        changeListenerToken: token
      }, (data, err) => {
        if (err) {
          throw err;
        }
        this.notifyStatusChange(data);
      });
      this._didStartStatusChangeListener = true;

      // Create ListenerToken wrapper
      const cblListenerToken = new _listenerToken.ListenerToken(token, async () => {
        // calling the remove listener native method
        await this._engine.listenerToken_Remove({
          changeListenerToken: token
        });
        this._replicatorListenerTokensByUuid.delete(token);
        this._didStartStatusChangeListener = false;
      });
      this._replicatorListenerTokensByUuid.set(token, cblListenerToken);
      return cblListenerToken;
    } else {
      throw new Error('Listener already started');
    }
  }
  async addDocumentChangeListener(listener) {
    const token = this._engine.getUUID() + "_doc";
    this._documentChangeListener.set(token, listener);
    await this._engine.replicator_AddDocumentChangeListener({
      replicatorId: this._replicatorId,
      changeListenerToken: token
    }, (data, err) => {
      if (err) {
        throw err;
      }
      if ((0, _documentReplication.isDocumentReplicationRepresentation)(data)) {
        this.notifyDocumentChange(data, token);
      } else {
        throw new Error('Invalid document replication change notification');
      }
    });

    // Create ListenerToken wrapper
    const cblListenerToken = new _listenerToken.ListenerToken(token, async () => {
      // calling the remove listener native method
      await this._engine.listenerToken_Remove({
        changeListenerToken: token
      });
      this._replicatorDocListenerTokensByUuid.delete(token);
      this._documentChangeListener.delete(token);
    });
    this._replicatorDocListenerTokensByUuid.set(token, cblListenerToken);
    return cblListenerToken;
  }

  /**
  * Creates a new Replicator instance for database synchronization
  * @param {ReplicatorConfiguration} config - The configuration for the replicator
  * @returns {Promise<Replicator>} A Promise that resolves to a new Replicator instance
  * @throws {Error} If the configuration is invalid or required parameters are missing
  */
  static async create(config) {
    if (config.getCollections().length === 0) {
      throw new Error('No collections specified in the configuration');
    }
    const engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);
    const configJson = config.toJson();
    try {
      const ret = await engine.replicator_Create({
        config: configJson
      });
      const replicator = new Replicator(ret.replicatorId, config.clone());
      return replicator;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Removes the replicator from the native engine and stops the replicator from running.
   * This will remove all listeners from the replicator.  As part of this, if you were to call
   * start after this method, a new replicator would be created Natively and a new replicator
   * id would be created.
   *
   * @function
   */
  async cleanup() {
    await this._engine.replicator_Cleanup({
      replicatorId: this._replicatorId
    });
    this._replicatorId = null;
  }

  /**
   * returns the replicator id used to manage the replicator between the engine and the
   * replicator native implementation.  This value should get set when the replicator is
   * created in the native engine via the start method.
   *
   * @function
   */
  getId() {
    return this._replicatorId;
  }

  /**
   * returns a copy of the replicators current configuration.
   * @function
   */
  getConfiguration() {
    return this._config;
  }

  /**
   * returns the replicators current status: its activity level and progress.
   *
   * @function
   */
  getStatus() {
    return this._engine.replicator_GetStatus({
      replicatorId: this._replicatorId
    });
  }

  /**
   * Get pending document ids for the given collection. If the given collection is not part of the replication, an error will be thrown.
   *
   * @function
   */
  async getPendingDocumentIds(collection) {
    const collections = this._config.getCollections();
    if (!collections.includes(collection)) {
      throw new Error('Collection not part of the replication');
    }
    return await this._engine.replicator_GetPendingDocumentIds({
      replicatorId: this._replicatorId,
      collectionName: collection.name,
      scopeName: collection.scope.name,
      name: collection.database.getUniqueName()
    });
  }

  /**
   * Check whether the document in the given collection is pending to push or not. If the given collection is not part of the replicator, an Exception will be thrown.
   *
   * @function
   */
  async isDocumentPending(documentId, collection) {
    const collections = this._config.getCollections();
    if (!collections.includes(collection)) {
      throw new Error('Collection not part of the replication');
    }
    return await this._engine.replicator_IsDocumentPending({
      replicatorId: this._replicatorId,
      documentId: documentId,
      collectionName: collection.name,
      scopeName: collection.scope.name,
      name: collection.database.getUniqueName()
    });
  }
  notifyDocumentChange(data, token) {
    const documents = data.documents.map(doc => {
      return {
        scopeName: doc.scopeName,
        collectionName: doc.collectionName,
        id: doc.id,
        flags: doc.flags,
        error: doc.error
      };
    });
    const documentReplication = {
      isPush: data.isPush,
      documents: documents
    };
    this._documentChangeListener.get(token)(documentReplication);
  }
  notifyStatusChange(data) {
    let status;
    const activityLevel = Number(data.activityLevel);
    const replicatorProgress = new _replicatorProgress.ReplicatorProgress(data.progress.completed, data.progress.total);
    if (data.error && typeof data.error.message === 'string') {
      status = new _replicatorStatus.ReplicatorStatus(activityLevel, replicatorProgress, data.error.message);
    } else {
      status = new _replicatorStatus.ReplicatorStatus(activityLevel, replicatorProgress, undefined);
    }
    const statusChange = {
      status: status
    };
    this._statusChangeListener(statusChange);
  }

  /**
   * Removes a change listener with the given listener token.
   *
   * @function
   */
  async removeChangeListener(token) {
    const uuidToken = typeof token === 'string' ? token : token.getUuidToken();

    // Check if it's a status change listener
    const statusListenerToken = this._replicatorListenerTokensByUuid.get(uuidToken);
    if (statusListenerToken) {
      await statusListenerToken.remove();
      return;
    }

    // Check if it's a document change listener
    const docListenerToken = this._replicatorDocListenerTokensByUuid.get(uuidToken);
    if (docListenerToken) {
      await docListenerToken.remove();
      return;
    }

    // Fallback: call generic bridge method directly
    await this._engine.listenerToken_Remove({
      changeListenerToken: uuidToken
    });

    // Cleanup - because we are using a unified map, we need to check if it's a document listener or a status listener
    if (this._documentChangeListener.has(uuidToken)) {
      // It's a document listener, so delete it from the map
      this._documentChangeListener.delete(uuidToken);
    } else {
      // It's a status listener so we need to reset the flag
      this._didStartStatusChangeListener = false;
    }
  }

  /**
   * Starts the replicator with an option to reset the local checkpoint of the replicator. When the
   * local checkpoint is reset, the replicator will sync all changes since the beginning of time from
   * the remote database.
   *
   * This method returns immediately; the replicator runs asynchronously and will report its progress
   * through the replicator change notification.
   *
   * @function
   *
   * @param {boolean} reset Resets the local checkpoint before starting the replicator.
   */
  async start(reset) {
    if (reset) {
      await this._engine.replicator_ResetCheckpoint({
        replicatorId: this._replicatorId
      });
      return;
    }
    await this._engine.replicator_Start({
      replicatorId: this._replicatorId
    });
  }

  /**
   * Stops a running replicator. This method returns immediately; when the replicator actually
   * stops, the replicator will change its status's activity level to
   * `ReplicatorActivityLevel.STOPPED` and the replicator change notification will be notified
   * accordingly.
   *
   * @function
   */
  stop() {
    return this._engine.replicator_Stop({
      replicatorId: this._replicatorId
    });
  }
}
exports.Replicator = Replicator;
//# sourceMappingURL=replicator.js.map