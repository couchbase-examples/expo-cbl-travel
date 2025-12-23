"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogSinks = void 0;
var _engineLocator = require("./engine-locator.js");
var _reactNativeUuid = _interopRequireDefault(require("react-native-uuid"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * LogSinks provides methods to configure logging in Couchbase Lite.
 * You can configure console logging, file logging, and custom logging.
 */
class LogSinks {
  static currentCustomToken = null;

  /**
   * Lazily retrieves the engine instance at runtime to ensure it's initialized
   */
  static get _engine() {
    return _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);
  }

  /**
   * Sets or disables console logging
   * @param config Configuration for console logging, or null to disable
   * @example
   * // Enable console logging
   * await LogSinks.setConsole({
   *   level: LogLevel.INFO,
   *   domains: [LogDomain.DATABASE, LogDomain.QUERY]
   * });
   * 
   * // Disable console logging
   * await LogSinks.setConsole(null);
   */
  static async setConsole(config) {
    if (config === null) {
      // Disable console logging - use sentinel value -1 for level
      await this._engine.logsinks_SetConsole({
        level: -1,
        domains: []
      });
    } else {
      // Enable console logging
      const domains = config.domains?.map(d => d.toString()) || [];
      await this._engine.logsinks_SetConsole({
        level: config.level,
        domains: domains
      });
    }
  }

  /**
   * Sets or disables file logging
   * @param config Configuration for file logging, or null to disable
   * @example
   * // Enable file logging
   * await LogSinks.setFile({
   *   level: LogLevel.DEBUG,
   *   directory: '/path/to/logs',
   *   usePlaintext: true,
   *   maxFileSize: 1024 * 1024, // 1MB
   *   maxKeptFiles: 5
   * });
   * 
   * // Disable file logging
   * await LogSinks.setFile(null);
   */
  static async setFile(config) {
    if (config === null) {
      // Disable file logging - use sentinel value -1 for level and empty config
      await this._engine.logsinks_SetFile({
        level: -1,
        config: {}
      });
    } else {
      // Enable file logging
      await this._engine.logsinks_SetFile({
        level: config.level,
        config: {
          directory: config.directory,
          usePlaintext: config.usePlaintext,
          maxFileSize: config.maxFileSize,
          maxKeptFiles: config.maxKeptFiles
        }
      });
    }
  }

  /**
   * Sets or disables custom logging with a callback
   * @param config Configuration for custom logging, or null to disable
   * @example
   * // Enable custom logging
   * await LogSinks.setCustom({
   *   level: LogLevel.VERBOSE,
   *   domains: [LogDomain.REPLICATOR, LogDomain.NETWORK],
   *   callback: (level, domain, message) => {
   *     console.log(`[${domain}] ${message}`);
   *   }
   * });
   * 
   * // Disable custom logging
   * await LogSinks.setCustom(null);
   */
  static async setCustom(config) {
    // Get access to the engine's callback map
    const engine = this._engine; // Cast to access customLogCallbacksMap

    if (config === null) {
      // Disable custom logging
      // First remove the callback from the map
      if (this.currentCustomToken) {
        engine.customLogCallbacksMap.delete(this.currentCustomToken);
        this.currentCustomToken = null;
      }

      // Then tell native to stop sending events - use sentinel value -1 and empty strings
      await engine.logsinks_SetCustom({
        level: -1,
        domains: [],
        token: ''
      });
    } else {
      // Enable custom logging

      // Clear any existing custom logger first
      if (this.currentCustomToken) {
        engine.customLogCallbacksMap.delete(this.currentCustomToken);
      }

      // Generate a unique token for this custom logger
      const token = _reactNativeUuid.default.v4().toString();

      // ✅ CRITICAL: Add callback to map BEFORE telling native
      // This ensures the callback exists when native starts sending events
      engine.customLogCallbacksMap.set(token, config.callback);
      this.currentCustomToken = token;

      // Now tell native to start sending log events with this token
      const domains = config.domains?.map(d => d.toString()) || [];
      try {
        await engine.logsinks_SetCustom({
          level: config.level,
          domains: domains,
          token: token
        });
      } catch (error) {
        // If native setup fails, clean up the callback
        engine.customLogCallbacksMap.delete(token);
        this.currentCustomToken = null;
        throw error;
      }
    }
  }
}
exports.LogSinks = LogSinks;
//# sourceMappingURL=log-sinks.js.map