package cbl.js.kotlin

import com.couchbase.lite.LogDomain
import com.couchbase.lite.LogLevel
import com.couchbase.lite.logging.BaseLogSink
import com.couchbase.lite.logging.ConsoleLogSink
import com.couchbase.lite.logging.FileLogSink
import com.couchbase.lite.logging.LogSinks

/**
 * LogSinksManager - Manages the three log sinks (Console, File, Custom) for Couchbase Lite
 * This is the Android equivalent of iOS's LogSinksManager.swift
 */
object LogSinksManager {

    // ============================================================
    // CONSOLE SINK
    // ============================================================

    /**
     * Sets the console log sink with the specified level and domains.
     * Pass null values to disable the console sink.
     *
     * @param level The log level (0=DEBUG, 1=VERBOSE, 2=INFO, 3=WARNING, 4=ERROR, 5=NONE), or null to disable
     * @param domains List of domain strings (DATABASE, QUERY, REPLICATOR, NETWORK, LISTENER), or null to disable
     */
    fun setConsoleSink(level: Int?, domains: List<String>?) {
        if (level == null || domains == null) {
            // null means disable
            LogSinks.get().console = null
            return
        }

        val logLevel = convertLogLevel(level)
        val logDomains = convertLogDomains(domains)
        LogSinks.get().console = ConsoleLogSink(logLevel, logDomains)
    }

    // ============================================================
    // FILE SINK
    // ============================================================

    /**
     * Sets the file log sink with the specified level and configuration.
     * Pass null values to disable the file sink.
     *
     * @param level The log level (0=DEBUG, 1=VERBOSE, 2=INFO, 3=WARNING, 4=ERROR, 5=NONE), or null to disable
     * @param config Map containing file logging configuration:
     *   - "directory" (String, required): Directory path for log files
     *   - "usePlaintext" (Boolean, optional): Use plaintext instead of binary format
     *   - "maxFileSize" (Number, optional): Maximum size of a log file in bytes
     *   - "maxKeptFiles" (Number, optional): Maximum number of rotated log files to keep
     */
    fun setFileSink(level: Int?, config: Map<String, Any>?) {
        if (level == null || config == null) {
            // null means disable
            LogSinks.get().file = null
            return
        }

        val directory = config["directory"] as? String
        if (directory.isNullOrEmpty()) {
            throw IllegalArgumentException("Directory is required and cannot be empty")
        }

        val logLevel = convertLogLevel(level)

        // Clean the directory path (remove file:// prefix if present)
        val cleanDir = directory.replace("file://", "")

        val usePlaintext = config["usePlaintext"] as? Boolean ?: false
        // Only pass maxFileSize/maxKeptFiles if user provides them; CBL handles defaults internally
        val maxFileSize = (config["maxFileSize"] as? Number)?.toLong()
        val maxKeptFiles = (config["maxKeptFiles"] as? Number)?.toInt()

        // Use Builder pattern to create FileLogSink
        val builder = FileLogSink.Builder()
            .setDirectory(cleanDir)
            .setLevel(logLevel)
        
        // TODO: Add usePlaintext when we find the correct method name
        maxFileSize?.let { builder.setMaxFileSize(it) }
        maxKeptFiles?.let { builder.setMaxKeptFiles(it) }
        
        LogSinks.get().file = builder.build()
    }

    // ============================================================
    // CUSTOM SINK
    // ============================================================

    /**
     * Sets the custom log sink with the specified level, domains, and callback.
     * Pass null values to disable the custom sink.
     *
     * @param level The log level (0=DEBUG, 1=VERBOSE, 2=INFO, 3=WARNING, 4=ERROR, 5=NONE), or null to disable
     * @param domains List of domain strings (DATABASE, QUERY, REPLICATOR, etc.), or null to disable
     * @param callback Callback function to receive log messages, or null to disable
     */
    fun setCustomSink(
        level: Int?,
        domains: List<String>?,
        callback: ((LogLevel, LogDomain, String) -> Unit)?
    ) {
        if (level == null || domains == null || callback == null) {
            // null means disable
            LogSinks.get().custom = null
            return
        }

        val logLevel = convertLogLevel(level)
        val logDomains = convertLogDomains(domains)

        // Create a custom logger that extends BaseLogSink
        val customLogger = object : BaseLogSink(logLevel, logDomains) {
            override fun writeLog(level: LogLevel, domain: LogDomain, message: String) {
                callback(level, domain, message)
            }
        }

        LogSinks.get().custom = customLogger
    }

    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================

    /**
     * Converts an integer log level to the LogLevel enum
     */
    private fun convertLogLevel(level: Int): LogLevel {
        return when (level) {
            0 -> LogLevel.DEBUG
            1 -> LogLevel.VERBOSE
            2 -> LogLevel.INFO
            3 -> LogLevel.WARNING
            4 -> LogLevel.ERROR
            5 -> LogLevel.NONE
            else -> throw IllegalArgumentException(
                "Invalid log level: $level. Must be 0-5 (DEBUG, VERBOSE, INFO, WARNING, ERROR, NONE)"
            )
        }
    }

    /**
     * Converts a list of domain strings to a Set of LogDomain
     */
    private fun convertLogDomains(domains: List<String>): Set<LogDomain> {
        // Empty list or "ALL" means all domains
        if (domains.isEmpty() || domains.any { it.uppercase() == "ALL" }) {
            return LogDomain.ALL
        }

        val result = mutableSetOf<LogDomain>()
        for (domain in domains) {
            when (domain.uppercase()) {
                "DATABASE" -> result.add(LogDomain.DATABASE)
                "QUERY" -> result.add(LogDomain.QUERY)
                "REPLICATOR" -> result.add(LogDomain.REPLICATOR)
                "NETWORK" -> result.add(LogDomain.NETWORK)
                "LISTENER" -> result.add(LogDomain.LISTENER)
                else -> throw IllegalArgumentException(
                    "Invalid domain: '$domain'. Valid domains: DATABASE, QUERY, REPLICATOR, NETWORK, LISTENER, ALL"
                )
            }
        }

        return result
    }

    /**
     * Converts a LogDomain enum to its string representation
     * Used for sending events back to JavaScript
     */
    fun logDomainToString(domain: LogDomain): String {
        return when (domain) {
            LogDomain.DATABASE -> "DATABASE"
            LogDomain.QUERY -> "QUERY"
            LogDomain.REPLICATOR -> "REPLICATOR"
            LogDomain.NETWORK -> "NETWORK"
            LogDomain.LISTENER -> "LISTENER"
            else -> "UNKNOWN"
        }
    }
}