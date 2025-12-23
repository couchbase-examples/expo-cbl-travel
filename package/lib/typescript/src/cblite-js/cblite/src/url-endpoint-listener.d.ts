import { URLEndpointListenerCreateArgs, URLEndpointListenerStatus, URLEndpointListenerTLSIdentityArgs } from '../core-types';
import { CollectionJson } from './collection';
/**
 * URLEndpointListener manages the lifecycle of a Couchbase Lite URL Endpoint Listener.
 * Use the static `create` method to instantiate and configure a listener.
 *
 * Example usage:
 * ```typescript
 * const listener = await URLEndpointListener.create({
 *   collections: [...],
 *   port: 55990,
 *   networkInterface: '0.0.0.0',
 *   disableTLS: false,        // Optional: disables TLS if true
 *   enableDeltaSync: true     // Optional: enables delta sync if true
 * });
 * await listener.start();
 * ```
 *
 * - If `disableTLS` is not provided, TLS is enabled by default.
 * - If `enableDeltaSync` is not provided, delta sync is disabled by default.
 * - Use `listener.stop()` to stop the listener.
 */
export declare class URLEndpointListener {
    private _listenerId;
    private readonly _collections;
    private readonly _port;
    private readonly _networkInterface?;
    private readonly _disableTLS?;
    private readonly _enableDeltaSync?;
    private readonly _authenticatorConfig?;
    private _engine;
    /**
     * Private constructor. Use the static `create` method to instantiate.
     */
    private constructor();
    /**
     * Asynchronously creates and configures a new URLEndpointListener.
     * @param args Listener configuration arguments.
     * @returns A Promise that resolves to a URLEndpointListener instance.
     */
    static create(args: URLEndpointListenerCreateArgs): Promise<URLEndpointListener>;
    /**
     * Starts the listener.
     */
    start(): Promise<void>;
    /**
     * Stops the listener.
     */
    stop(): Promise<void>;
    /**
     * Returns the listener ID.
     */
    getId(): string | undefined;
    /**
     * Returns the collections associated with this listener.
     */
    getCollections(): CollectionJson[];
    /**
     * Returns the port the listener is configured to use.
     */
    getPort(): number;
    /**
     * Returns the network interface the listener is bound to, if set.
     */
    getNetworkInterface(): string | undefined;
    /**
     * Returns whether TLS is disabled for this listener.
     */
    getDisableTLS(): boolean;
    /**
     * Returns whether delta sync is enabled for this listener.
     */
    getEnableDeltaSync(): boolean;
    /**
     * Gets the current status of the listener from the native engine.
     * @returns A promise that resolves to the listener status.
     */
    getStatus(): Promise<URLEndpointListenerStatus>;
    /**
     * Deletes the listener identity from the native engine.
     * @param args The arguments for deleting the listener identity.
     */
    static deleteIdentity(args: URLEndpointListenerTLSIdentityArgs): Promise<void>;
}
//# sourceMappingURL=url-endpoint-listener.d.ts.map