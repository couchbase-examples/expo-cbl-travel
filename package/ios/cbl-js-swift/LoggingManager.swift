//
//  LoggingManager.swift
//  CbliteSwiftJsLib
//
//  Created by Aaron LaBeau on 09/04/24.
//

import Foundation
import CouchbaseLiteSwift

enum LoggingError: Error {
    case invalidDomain(message: String)
    case invalidLogLevel(message: String)
    case invalidConfig(message: String)
}

public class LoggingManager {

    // MARK: - Singleton
    public static let shared = LoggingManager()

    // MARK: - Private initializer to prevent external instatiation
    private init() {

    }

    public func setLogLevel(_ logDomain: String, logLevel: Int) throws {
        switch logDomain {
            case "ALL": Database.log.console.domains = .all
            case "DATABASE": Database.log.console.domains = .database
            case "NETWORK": Database.log.console.domains = .network
            case "QUERY": Database.log.console.domains = .query
            case "REPLICATOR": Database.log.console.domains = .replicator
            default:
                throw LoggingError.invalidDomain(message: "Invalid domain value \(logDomain)")
        }
        if let logLevelValue = LogLevel(rawValue: UInt8(logLevel)) {
            Database.log.console.level = logLevelValue
        } else {
            throw LoggingError.invalidLogLevel(message: "Invalid level value \(logLevel)")
        }
    }

    public func setFileLogging(_ databaseName: String,
                               config: [String: Any]) throws {
        /*
        guard let database = DatabaseManager.shared.getDatabase(databaseName) else {
            throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
        }
        */
        guard let logLevel = config["level"] as? Int,
              let directory = config["directory"] as? String,
              !directory.isEmpty else {
            throw LoggingError.invalidConfig(message: "Invalid configuration of level or directory")
        }

        let rawDir = directory.replacingOccurrences(of: "file://", with: "")
        let fileLoggingConfig = LogFileConfiguration(directory: rawDir)

        if let maxRotateCount = config["maxRotateCount"] as? Int {
            fileLoggingConfig.maxRotateCount = maxRotateCount
        }

        if let maxSize = config["maxSize"] as? UInt64, maxSize > 0 {
            fileLoggingConfig.maxSize = maxSize
        }

        if let usePlaintext = config["usePlaintext"] as? Bool {
            fileLoggingConfig.usePlainText = usePlaintext
        }
        if let logLevelValue = LogLevel(rawValue: UInt8(logLevel)) {
            Database.log.file.level = logLevelValue
        } else {
            throw LoggingError.invalidLogLevel(message: "Invalid level value \(logLevel)")
        }

        Database.log.file.config = fileLoggingConfig
    }
}
