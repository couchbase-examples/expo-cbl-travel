import { ReplicatorConfiguration } from './replicator-configuration';
import {
  ICoreEngine,
  ReplicatorChangeListener,
  ReplicatorDocumentChangeListener,
} from '../core-types';
import { EngineLocator } from './engine-locator';
import { ReplicatorStatus } from './replicator-status';
import { ReplicatorActivityLevel } from './replicator-activity-level';
import { ReplicatorProgress } from './replicator-progress';
import {
  DocumentReplicationRepresentation,
  isDocumentReplicationRepresentation,
} from './document-replication';
import { Collection } from './collection';

export class Replicator {
  private _replicatorId: string = undefined;
  private status: ReplicatorStatus;
  private readonly _config: ReplicatorConfiguration;
  private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);

  //replication status change listener support
  private _statusChangeListener: ReplicatorChangeListener;
  private _didStartStatusChangeListener: boolean = false;

  private _documentChangeListener: Map<
    string,
    ReplicatorDocumentChangeListener
  >;

  /**
   * Initializes a replicator with the given configuration
   *
   * @param config
   */
  private constructor(replicatorId: string, config: ReplicatorConfiguration) {
    this._replicatorId = replicatorId;
    this._config = config;
    this._documentChangeListener = new Map<
      string,
      ReplicatorDocumentChangeListener
    >();
  }

  /**
   * Adds a replicator change listener for listening to status updates
   *
   * @function
   *
   */
  async addChangeListener(listener: ReplicatorChangeListener): Promise<string> {
    this._statusChangeListener = listener;
    const token = this._engine.getUUID();
    if (!this._didStartStatusChangeListener) {
      await this._engine.replicator_AddChangeListener(
        {
          replicatorId: this._replicatorId,
          changeListenerToken: token,
        },
        (data, err) => {
          if (err) {
            throw err;
          }
          this.notifyStatusChange(data);
        }
      );
      this._didStartStatusChangeListener = true;
      return token;
    } else {
      throw new Error('Listener already started');
    }
  }

  async addDocumentChangeListener(
    listener: ReplicatorDocumentChangeListener
  ): Promise<string> {
    const token = this._engine.getUUID();
    this._documentChangeListener.set(token, listener);
    await this._engine.replicator_AddDocumentChangeListener(
      {
        replicatorId: this._replicatorId,
        changeListenerToken: token,
      },
      (data, err) => {
        if (err) {
          throw err;
        }
        if (isDocumentReplicationRepresentation(data)) {
          this.notifyDocumentChange(data, token);
        } else {
          throw new Error('Invalid document replication change notification');
        }
      }
    );
    return token;
  }

  static async create(config: ReplicatorConfiguration): Promise<Replicator> {
    if (config.getCollections().length === 0) {
      throw new Error('No collections specified in the configuration');
    }
    const engine = EngineLocator.getEngine(EngineLocator.key);
    const configJson = config.toJson();
    const ret = await engine.replicator_Create({ config: configJson });
    const replicator = new Replicator(ret.replicatorId, config);
    return replicator;
  }

  /**
   * Removes the replicator from the native engine and stops the replicator from running.
   * This will remove all listeners from the replicator.  As part of this, if you were to call
   * start after this method, a new replicator would be created Natively and a new replicator
   * id would be created.
   *
   * @function
   */
  async cleanup(): Promise<void> {
    await this._engine.replicator_Cleanup({ replicatorId: this._replicatorId });
    this._replicatorId = null;
  }

  /**
   * returns the replicator id used to manage the replicator between the engine and the
   * replicator native implementation.  This value should get set when the replicator is
   * created in the native engine via the start method.
   *
   * @function
   */
  getId(): string | undefined {
    return this._replicatorId;
  }

  /**
   * returns a copy of the replicators current configuration.
   * @function
   */
  getConfiguration(): ReplicatorConfiguration {
    return this._config;
  }

  /**
   * returns the replicators current status: its activity level and progress.
   *
   * @function
   */
  getStatus(): Promise<ReplicatorStatus> {
    return this._engine.replicator_GetStatus({
      replicatorId: this._replicatorId,
    });
  }

  /**
   * Get pending document ids for the given collection. If the given collection is not part of the replication, an error will be thrown.
   *
   * @function
   */
  async getPendingDocumentIds(
    collection: Collection
  ): Promise<{ pendingDocumentIds: string[] }> {
    const collections = this._config.getCollections();
    if (!collections.includes(collection)) {
      throw new Error('Collection not part of the replication');
    }
    return await this._engine.replicator_GetPendingDocumentIds({
      replicatorId: this._replicatorId,
      collectionName: collection.name,
      scopeName: collection.scope.name,
      name: collection.database.getName(),
    });
  }

  /**
   * Check whether the document in the given collection is pending to push or not. If the given collection is not part of the replicator, an Exception will be thrown.
   *
   * @function
   */
  async isDocumentPending(
    documentId: string,
    collection: Collection
  ): Promise<{ isPending: boolean }> {
    const collections = this._config.getCollections();
    if (!collections.includes(collection)) {
      throw new Error('Collection not part of the replication');
    }
    return await this._engine.replicator_IsDocumentPending({
      replicatorId: this._replicatorId,
      documentId: documentId,
      collectionName: collection.name,
      scopeName: collection.scope.name,
      name: collection.database.getName(),
    });
  }

  private notifyDocumentChange(
    data: DocumentReplicationRepresentation,
    token: string
  ) {
    const documents = data.documents.map((doc) => {
      return {
        scopeName: doc.scopeName,
        collectionName: doc.collectionName,
        id: doc.id,
        flags: doc.flags,
        error: doc.error,
      };
    });
    const documentReplication = { isPush: data.isPush, documents: documents };
    this._documentChangeListener.get(token)(documentReplication);
  }

  private notifyStatusChange(data: any) {
    let status: ReplicatorStatus | undefined;
    const activityLevel = Number(data.activityLevel) as ReplicatorActivityLevel;
    const replicatorProgress = new ReplicatorProgress(
      data.progress.completed,
      data.progress.total
    );
    if (data.error && typeof data.error.message === 'string') {
      status = new ReplicatorStatus(
        activityLevel,
        replicatorProgress,
        data.error.message
      );
    } else {
      status = new ReplicatorStatus(
        activityLevel,
        replicatorProgress,
        undefined
      );
    }
    const statusChange = { status: status };
    this._statusChangeListener(statusChange);
  }

  /**
   * Removes a change listener with the given listener token.
   *
   * @function
   */
  async removeChangeListener(token: string): Promise<void> {
    await this._engine.replicator_RemoveChangeListener({
      replicatorId: this._replicatorId,
      changeListenerToken: token,
    });
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
  async start(reset: boolean | undefined): Promise<void> {
    if (reset) {
      await this._engine.replicator_ResetCheckpoint({
        replicatorId: this._replicatorId,
      });
      return;
    }
    await this._engine.replicator_Start({ replicatorId: this._replicatorId });
  }

  /**
   * Stops a running replicator. This method returns immediately; when the replicator actually
   * stops, the replicator will change its status's activity level to
   * `ReplicatorActivityLevel.STOPPED` and the replicator change notification will be notified
   * accordingly.
   *
   * @function
   */
  stop(): Promise<void> {
    return this._engine.replicator_Stop({ replicatorId: this._replicatorId });
  }
}
