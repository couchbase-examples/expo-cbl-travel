export const __esModule: boolean;
export class Replicator {
    static create(config: any): Promise<Replicator>;
    /**
     * Initializes a replicator with the given configuration
     *
     * @param config
     */
    constructor(replicatorId: any, config: any);
    _replicatorId: any;
    _engine: any;
    _didStartStatusChangeListener: boolean;
    _config: any;
    _documentChangeListener: Map<any, any>;
    /**
     * Adds a replicator change listener for listening to status updates
     *
     * @function
     *
     */
    addChangeListener(listener: any): Promise<any>;
    _statusChangeListener: any;
    addDocumentChangeListener(listener: any): Promise<any>;
    /**
     * Removes the replicator from the native engine and stops the replicator from running.
     * This will remove all listeners from the replicator.  As part of this, if you were to call
     * start after this method, a new replicator would be created Natively and a new replicator
     * id would be created.
     *
     * @function
     */
    cleanup(): Promise<void>;
    /**
     * returns the replicator id used to manage the replicator between the engine and the
     * replicator native implementation.  This value should get set when the replicator is
     * created in the native engine via the start method.
     *
     * @function
     */
    getId(): any;
    /**
     * returns a copy of the replicators current configuration.
     * @function
     */
    getConfiguration(): any;
    /**
     * returns the replicators current status: its activity level and progress.
     *
     * @function
     */
    getStatus(): any;
    /**
     * Get pending document ids for the given collection. If the given collection is not part of the replication, an error will be thrown.
     *
     * @function
     */
    getPendingDocumentIds(collection: any): Promise<any>;
    /**
     * Check whether the document in the given collection is pending to push or not. If the given collection is not part of the replicator, an Exception will be thrown.
     *
     * @function
     */
    isDocumentPending(documentId: any, collection: any): Promise<any>;
    notifyDocumentChange(data: any, token: any): void;
    notifyStatusChange(data: any): void;
    /**
     * Removes a change listener with the given listener token.
     *
     * @function
     */
    removeChangeListener(token: any): Promise<void>;
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
    start(reset: boolean): Promise<void>;
    /**
     * Stops a running replicator. This method returns immediately; when the replicator actually
     * stops, the replicator will change its status's activity level to
     * `ReplicatorActivityLevel.STOPPED` and the replicator change notification will be notified
     * accordingly.
     *
     * @function
     */
    stop(): any;
}
//# sourceMappingURL=replicator.d.cts.map