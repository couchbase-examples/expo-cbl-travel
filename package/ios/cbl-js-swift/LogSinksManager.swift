

import Foundation
import CouchbaseLiteSwift

enum LogSinksError: Error {
    case invalidLogLevel(message: String)
    case invalidConfig(message:String)
    case invalidDomain(message: String)
}

public class LogSinksManager {

    public static let shared = LogSinksManager()

    private init() {}

    ////////////// CONSOLE SINK
    /// Sets the console log sink with the specified level and domains.
    /// Pass nil values to disable the console sink.
    ///
    /// - Parameters:
    ///   - level: The log level (0=DEBUG, 1=VERBOSE, 2=INFO, 3=WARNING, 4=ERROR, 5=NONE), or nil to disable
    ///   - domains: Array of domain strings (DATABASE, QUERY, REPLICATOR, NETWORK, listener, peerDiscovery, mdns, multipeer), or nil to disable
    /// - Throws: LogSinksError if level or domains are invalid
    public func setConsoleSink(level: Int?, domains: [String]?) throws{
        guard let level = level, let domains = domains else {
            
            // nil means disable
            LogSinks.console = nil
            return
        }

        let logLevel = try convertLogLevel(level)
        let logDomains = try convertLogDomains(domains)
        LogSinks.console = ConsoleLogSink(level: logLevel, domains: logDomains)

    }




    ////////////////// FILE SINK 
    /// Sets the file log sink with the specified level and configuration.
    /// Pass nil values to disable the file sink.
    ///
    /// - Parameters:
    ///   - level: The log level (0=DEBUG, 1=VERBOSE, 2=INFO, 3=WARNING, 4=ERROR, 5=NONE), or nil to disable
    ///   - config: Dictionary containing file logging configuration:
    ///       - "directory" (String, required): Directory path for log files
    ///       - "usePlaintext" (Bool, optional): Use plaintext instead of binary format
    ///       - "maxFileSize" (UInt64, optional): Maximum size of a log file in bytes
    ///       - "maxKeptFiles" (Int, optional): Maximum number of rotated log files to keep
    /// - Throws: LogSinksError if configuration is invalid
    public func setFileSink(level: Int?, config: [String: Any]?) throws {
        guard let level = level, let config = config else {
            // nil means disable

            LogSinks.file = nil
            return
        }

        guard let directory = config["directory"] as? String, !directory.isEmpty else {
            throw LogSinksError.invalidConfig(message: "Directory is required and cannot be empty")
        }

        let logLevel = try convertLogLevel(level)
        let cleanDir = directory.replacingOccurrences(of: "file://", with: "")

        let usePlainText = config["usePlaintext"] as? Bool ?? false
        // Only pass maxFileSize/maxKeptFiles if user provides them; CBL handles defaults internally
        let maxFileSize = (config["maxFileSize"] as? NSNumber)?.int64Value
        let maxKeptFiles = (config["maxKeptFiles"] as? NSNumber)?.int32Value

        // Use initializer that lets CBL apply its internal defaults for optional params
        if let maxFileSize = maxFileSize, let maxKeptFiles = maxKeptFiles {
            LogSinks.file = FileLogSink(
                level: logLevel,
                directory: cleanDir,
                usePlainText: usePlainText,
                maxKeptFiles: maxKeptFiles,
                maxFileSize: maxFileSize
            )
        } else {
            // Let CBL use its defaults - create with minimal params
            LogSinks.file = FileLogSink(level: logLevel, directory: cleanDir)
        }
    }


    /////////////// CUSTOM SINK
    /// Sets the custom log sink with the specified level, domains, and callback.
    /// Pass nil values to disable the custom sink.
    ///
    /// - Parameters:
    ///   - level: The log level (0=DEBUG, 1=VERBOSE, 2=INFO, 3=WARNING, 4=ERROR, 5=NONE), or nil to disable
    ///   - domains: Array of domain strings (DATABASE, QUERY, REPLICATOR, etc.), or nil to disable
    ///   - callback: Callback function to receive log messages, or nil to disable
    /// - Throws: LogSinksError if level or domains are invalid
    public func setCustomSink(
        level: Int?,
        domains: [String]?,
        callback: ((LogLevel, LogDomain, String) -> Void)?
    ) throws {
        guard let level = level, let domains = domains, let callback = callback else {
            // nil means disable
            LogSinks.custom = nil
            return
        }
        
        let logLevel = try convertLogLevel(level)
        let logDomains = try convertLogDomains(domains)
        let customLogger = CustomLogger(callback: callback)
        LogSinks.custom = CustomLogSink(level: logLevel, domains: logDomains, logSink: customLogger)
    }


    
    //////// HELPER FUNCTIONS

    /// Converts an integer log level to the LogLevel enum
    private func convertLogLevel(_ level: Int) throws -> LogLevel {
        guard let logLevel = LogLevel(rawValue: UInt8(level)) else { 
            throw LogSinksError.invalidLogLevel(message: "Invalid log level: \(level). Must be 0-5 (DEBUG, VERBOSE, INFO, WARNING, ERROR, NONE)")
        }

        return logLevel
    }

    
    /// Converts an array of domain strings to LogDomains option set
    private func convertLogDomains(_ domains: [String]) throws -> LogDomains {
        // Empty arrray or "ALL" means all domains

        if(domains.isEmpty || domains.contains(where: { $0.uppercased() == "ALL"}) ) {
            return .all
        }

        var results: LogDomains = []

        for domain in domains {
            switch domain.uppercased() {
                case "DATABASE": 
                    results.insert(.database)
                case "QUERY": 
                    results.insert(.query)
                case "REPLICATOR":
                    results.insert(.replicator)
                case "NETWORK":
                    results.insert(.network)
                case "LISTENER": 
                    results.insert(.listener)
                case "PEER_DISCOVERY", "PEERDISCOVERY": 
                    results.insert(.peerDiscovery)
                case "MDNS":
                    results.insert(.mdns)
                case "MULTIPEER":
                    results.insert(.multipeer)
                default:
                    throw LogSinksError.invalidDomain(message: "Invalid domain: '\(domain)'. Valid domains: DATABASE, QUERY, REPLICATOR, NETWORK, LISTENER, PEER_DISCOVERY, MDNS, MULTIPEER, ALL")
            }
        }

        return results
    }


    // MARK: - Custom Logger Implementation

    /// Internal class that implements LogSinkProtocol to bridge to the callback function
    private class CustomLogger: LogSinkProtocol {
        let callback: (LogLevel, LogDomain, String) -> Void
    
        init(callback: @escaping (LogLevel, LogDomain, String) -> Void) {
            self.callback = callback
        }
    
        func writeLog(level: LogLevel, domain: LogDomain, message: String) {
           callback(level, domain, message)
        }
}


}