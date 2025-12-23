import type { ConsoleLogSinkConfig, FileLogSinkConfig, CustomLogSinkConfig } from './log-sinks-types';
/**
 * LogSinks provides methods to configure logging in Couchbase Lite.
 * You can configure console logging, file logging, and custom logging.
 */
export declare class LogSinks {
    private static currentCustomToken;
    /**
     * Lazily retrieves the engine instance at runtime to ensure it's initialized
     */
    private static get _engine();
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
    static setConsole(config: ConsoleLogSinkConfig | null): Promise<void>;
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
    static setFile(config: FileLogSinkConfig | null): Promise<void>;
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
    static setCustom(config: CustomLogSinkConfig | null): Promise<void>;
}
//# sourceMappingURL=log-sinks.d.ts.map