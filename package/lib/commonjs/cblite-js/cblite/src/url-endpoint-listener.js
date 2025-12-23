"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.URLEndpointListener = void 0;
var _engineLocator = require("./engine-locator.js");
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
class URLEndpointListener {
  _engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);

  /**
   * Private constructor. Use the static `create` method to instantiate.
   */
  constructor(args, listenerId) {
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
  static async create(args) {
    const engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);
    const {
      listenerId
    } = await engine.URLEndpointListener_createListener(args);
    return new URLEndpointListener(args, listenerId);
  }

  /**
   * Starts the listener.
   */
  async start() {
    await this._engine.URLEndpointListener_startListener({
      listenerId: this._listenerId
    });
  }

  /**
   * Stops the listener.
   */
  async stop() {
    await this._engine.URLEndpointListener_stopListener({
      listenerId: this._listenerId
    });
  }

  /**
   * Returns the listener ID.
   */
  getId() {
    return this._listenerId;
  }

  /**
   * Returns the collections associated with this listener.
   */
  getCollections() {
    return this._collections;
  }

  /**
   * Returns the port the listener is configured to use.
   */
  getPort() {
    return this._port;
  }

  /**
   * Returns the network interface the listener is bound to, if set.
   */
  getNetworkInterface() {
    return this._networkInterface;
  }

  /**
   * Returns whether TLS is disabled for this listener.
   */
  getDisableTLS() {
    return !!this._disableTLS;
  }

  /**
   * Returns whether delta sync is enabled for this listener.
   */
  getEnableDeltaSync() {
    return !!this._enableDeltaSync;
  }

  /**
   * Gets the current status of the listener from the native engine.
   * @returns A promise that resolves to the listener status.
   */
  async getStatus() {
    return await this._engine.URLEndpointListener_getStatus({
      listenerId: this._listenerId
    });
  }

  /**
   * Deletes the listener identity from the native engine.
   * @param args The arguments for deleting the listener identity.
   */
  static async deleteIdentity(args) {
    return await _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key).URLEndpointListener_deleteIdentity(args);
  }
}
exports.URLEndpointListener = URLEndpointListener;
//# sourceMappingURL=url-endpoint-listener.js.map