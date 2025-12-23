import {
  ICoreEngine,
  ListenerAuthenticatorConfig,
  URLEndpointListenerCreateArgs,
  URLEndpointListenerStatus,
  URLEndpointListenerTLSIdentityArgs,
} from '../core-types';
import { CollectionJson } from './collection';
import { EngineLocator } from './engine-locator';

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
export class URLEndpointListener {
  private _listenerId: string;
  private readonly _collections: CollectionJson[];
  private readonly _port: number;
  private readonly _networkInterface?: string;
  private readonly _disableTLS?: boolean;
  private readonly _enableDeltaSync?: boolean;
  private readonly _authenticatorConfig?: ListenerAuthenticatorConfig;
  private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);

  /**
   * Private constructor. Use the static `create` method to instantiate.
   */
  private constructor(args: URLEndpointListenerCreateArgs, listenerId: string) {
    this._collections = args.collections;
    this._port = args.port;
    this._networkInterface = args.networkInterface;
    this._disableTLS = args.disableTLS;
    this._enableDeltaSync = args.enableDeltaSync;
    this._listenerId = listenerId;
    this._authenticatorConfig = args.authenticatorConfig;
  }

  /**
   * Asynchronously creates and configures a new URLEndpointListener.
   * @param args Listener configuration arguments.
   * @returns A Promise that resolves to a URLEndpointListener instance.
   */
  static async create(args: URLEndpointListenerCreateArgs): Promise<URLEndpointListener> {
    const engine = EngineLocator.getEngine(EngineLocator.key);
    const { listenerId } = await engine.URLEndpointListener_createListener(args);
    return new URLEndpointListener(args, listenerId);
  }

  /**
   * Starts the listener.
   */
  async start(): Promise<void> {
    await this._engine.URLEndpointListener_startListener({ listenerId: this._listenerId });
  }

  /**
   * Stops the listener.
   */
  async stop(): Promise<void> {
    await this._engine.URLEndpointListener_stopListener({ listenerId: this._listenerId });
  }

  /**
   * Returns the listener ID.
   */
  getId(): string | undefined {
    return this._listenerId;
  }

  /**
   * Returns the collections associated with this listener.
   */
  getCollections(): CollectionJson[] {
    return this._collections;
  }

  /**
   * Returns the port the listener is configured to use.
   */
  getPort(): number {
    return this._port;
  }

  /**
   * Returns the network interface the listener is bound to, if set.
   */
  getNetworkInterface(): string | undefined {
    return this._networkInterface;
  }

  /**
   * Returns whether TLS is disabled for this listener.
   */
  getDisableTLS(): boolean {
    return !!this._disableTLS;
  }

  /**
   * Returns whether delta sync is enabled for this listener.
   */
  getEnableDeltaSync(): boolean {
    return !!this._enableDeltaSync;
  }

  /**
   * Gets the current status of the listener from the native engine.
   * @returns A promise that resolves to the listener status.
   */
  async getStatus(): Promise<URLEndpointListenerStatus> {
    return await this._engine.URLEndpointListener_getStatus({ listenerId: this._listenerId });
  }

  /**
   * Deletes the listener identity from the native engine.
   * @param args The arguments for deleting the listener identity.
   */
  static async deleteIdentity(args: URLEndpointListenerTLSIdentityArgs): Promise<void> {
    return await EngineLocator.getEngine(EngineLocator.key).URLEndpointListener_deleteIdentity(args);
  }
}
