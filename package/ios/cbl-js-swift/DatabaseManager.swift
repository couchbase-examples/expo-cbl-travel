//
//  DatabaseManager.swift
//  Created by Aaron LaBeau on 07/04/24.
//

import Foundation
import CouchbaseLiteSwift

enum DatabaseError: Error {
    case invalidDatabaseName(databaseName: String)
    case unableToOpenDatabase(databaseName: String)
    case unableToCloseDatabase(databaseName: String)
    case unableToDeleteDatabase(message: String, databaseName: String)
    case databaseLocked(databaseName: String)
    case copyError(message: String)
    case maintenanceError(message: String)
    case unknownError(message: String)
}

public class DatabaseManager {

    // MARK: - Private for management of state
    var openDatabases = [String: Database]()
    var queryResultSets = [String: ResultSet]()

    /* change listeners */
    var databaseChangeListeners = [String: Any]()
    var queryChangeListeners = [String: Any]()

    var queryCount: Int = 0
    var replicatorCount: Int = 0
    var allResultsChunkSize: Int = 0

    /* collections */
    private var defaultCollectionName: String = "_default"
    private var defaultScopeName: String = "_default"

    // MARK: - Singleton
    public static let shared = DatabaseManager()

    // MARK: - Private initializer to prevent external instantiation
    private init() {
        // Initialization code here
    }

    // MARK: - Helper Functions

    public func getDatabase(_ name: String) -> Database? {
        objc_sync_enter(openDatabases)
        defer {
            objc_sync_exit(openDatabases)
        }

        return openDatabases[name]
    }

    public func buildDatabaseConfig(_ config: [AnyHashable: Any]?) -> DatabaseConfiguration {
        var databaseConfiguration = DatabaseConfiguration()
        if let encKey = config?["encryptionKey"] as? String {
            let key = EncryptionKey.password(encKey)
            databaseConfiguration.encryptionKey = key
        }
        if let directory = config?["directory"] as? String {
            // Used to auto set the database to be in the documents folder,
            // otherwise the directory won't work because we need a full path
            databaseConfiguration.directory = directory
        }
        return databaseConfiguration
    }

    // MARK: Database Functions

    public func open(_ databaseName: String, databaseConfig: [AnyHashable: Any]?) throws {
        do {
            if self.openDatabases[databaseName] != nil {
                self.openDatabases.removeValue(forKey: databaseName)
            }
            
            let config = self.buildDatabaseConfig(databaseConfig)
            let database = try Database(name: databaseName, config: config)
            self.openDatabases[databaseName] = database
        } catch {
            throw DatabaseError.unableToOpenDatabase(databaseName: databaseName)
        }
    }

    public func close(_ databaseName: String) throws {
        guard let database = self.getDatabase(databaseName) else {
            throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
        }
        do {
            try database.close()
        } catch {
            throw DatabaseError.unableToCloseDatabase(databaseName: databaseName)
        }
    }

    public func delete(_ databaseName: String) throws {
        guard let database = self.getDatabase(databaseName) else {
            throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
        }
        do {
            try database.delete()
            openDatabases.removeValue(forKey: databaseName)
        } catch {
            if let nsError = error as NSError?, nsError.code == 19 {
                // SQLite error code 19 (SQLITE_CONSTRAINT) indicates that the database is locked.
                throw DatabaseError.databaseLocked(databaseName: databaseName)
            } else {
                throw DatabaseError.unableToDeleteDatabase(message: "Error deleting database: \(error.localizedDescription)", databaseName: databaseName)
            }
        }
    }
    
    public func delete(_ databasePath:String, databaseName: String) throws {
        if self.openDatabases.keys.contains(databaseName)
        {
            throw DatabaseError.unableToDeleteDatabase(message:"Database is open or defined in context, use db.delete function instead.", databaseName: databaseName)
        }
        do {
            try Database.delete(withName: databaseName, inDirectory: databasePath)
            
        } catch {
            if let nsError = error as NSError?, nsError.code == 19 {
                // SQLite error code 19 (SQLITE_CONSTRAINT) indicates that the database is locked.
                throw DatabaseError.databaseLocked(databaseName: databaseName)
            } else {
                throw DatabaseError.unableToDeleteDatabase(message: "Error deleting database: \(error.localizedDescription)", databaseName: databaseName)
            }
        }
    }

    public func exists(_ databaseName: String, directoryPath: String) -> Bool {
        return Database.exists(withName: databaseName, inDirectory: directoryPath)
    }

    public func getPath(_ databaseName: String) throws -> String? {
        guard let database = self.getDatabase(databaseName) else {
            throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
        }
        return database.path
    }
    
    public func changeEncryptionKey(_ databaseName: String,
                                    newKey: String?) throws {
        guard let database = self.getDatabase(databaseName) else {
            throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
        }
        if let newKeyString =  newKey {
            let encryptionKey = EncryptionKey.password(newKeyString)
            try database.changeEncryptionKey(encryptionKey)
            return
        }
        try database.changeEncryptionKey(nil)
        return
    }

    public func copy(_ path: String, newName: String, databaseConfig: [AnyHashable: Any]?) throws {
        let config = self.buildDatabaseConfig(databaseConfig)
        do {
            try Database.copy(fromPath: path, toDatabase: newName, withConfig: config)
        } catch {
            throw DatabaseError.copyError(message: "\(error.localizedDescription)")
        }
    }

    // MARK: Database Maintenance Functions

    public func performMaintenance(_ databaseName: String, maintenanceType: MaintenanceType) throws {
        guard let database = self.getDatabase(databaseName) else {
            throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
        }

        do {
            try database.performMaintenance(type: maintenanceType)
        } catch {
            if let nsError = error as NSError? {
                if let reason = nsError.userInfo[NSLocalizedFailureReasonErrorKey] as? String {
                    throw DatabaseError.maintenanceError(message: "Unknown error: \(reason)")
                }
            }
            throw DatabaseError.maintenanceError(message: "Unknown error trying to perform maintenance \(error)")
        }
    }

    // MARK: Scope Functions

    public func scopes(_ databaseName: String) throws -> [Scope]? {
        do {
            guard let database = self.getDatabase(databaseName) else {
                throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
            }
            return try database.scopes()
        } catch {
            throw DatabaseError.unknownError(message: error.localizedDescription)
        }
    }

    public func defaultScope(_ databaseName: String) throws -> Scope? {
        do {
            guard let database = self.getDatabase(databaseName) else {
                throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
            }
            return try database.defaultScope()
        } catch {
            throw DatabaseError.unknownError(message: error.localizedDescription)
        }
    }

    public func scope(_ scopeName: String, databaseName: String) throws -> Scope? {
        do {
            guard let database = self.getDatabase(databaseName) else {
                throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
            }
            return try database.scope(name: scopeName)
        } catch {
            throw DatabaseError.unknownError(message: error.localizedDescription)
        }
    }

    // MARK: Collection Functions

    public func defaultCollection(_ databaseName: String) throws -> Collection? {
        do {
            guard let database = self.getDatabase(databaseName) else {
                throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
            }
            return try database.defaultCollection()
        } catch {
            throw DatabaseError.unknownError(message: error.localizedDescription)
        }
    }

    public func collections(_ scopeName: String, databaseName: String) throws -> [Collection]? {
        do {
            guard let database = self.getDatabase(databaseName) else {
                throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
            }
            return try database.collections(scope: scopeName)
        } catch {
            throw DatabaseError.unknownError(message: error.localizedDescription)
        }
    }

    public func createCollection(_ collectionName: String, scopeName: String, databaseName: String) throws -> Collection? {
        do {
            guard let database = self.getDatabase(databaseName) else {
                throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
            }
            return try database.createCollection(name: collectionName, scope: scopeName)
        } catch {
            throw DatabaseError.unknownError(message: error.localizedDescription)
        }
    }

    public func collection(_ collectionName: String, scopeName: String, databaseName: String) throws -> Collection? {
        do {
            guard let database = self.getDatabase(databaseName) else {
                throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
            }
            return try database.collection(name: collectionName, scope: scopeName)
        } catch {
            throw DatabaseError.unknownError(message: error.localizedDescription)
        }
    }

    public func deleteCollection(_ collectionName: String, scopeName: String, databaseName: String) throws {
        do {
            guard let database = self.getDatabase(databaseName) else {
                throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
            }
            try database.deleteCollection(name: collectionName, scope: scopeName)
        } catch {
            throw DatabaseError.unknownError(message: error.localizedDescription)
        }
    }

    // MARK: SQL++ Query Functions

    public func executeQuery(_ queryString: String,
                      parameters: [String: Any]? = nil,
                      databaseName: String) throws -> String {
        do {
            guard let database = self.getDatabase(databaseName) else {
                throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
            }
            let query = try database.createQuery(queryString)
            if let params = parameters {
                let queryParams = try QueryHelper.getParamatersFromJson(params)
                query.parameters = queryParams
            }
            let results = try query.execute()
            let resultJSONs = results.map { $0.toJSON() }
            let jsonArray = "[" + resultJSONs.joined(separator: ",") + "]"
            return jsonArray
        } catch {
            throw error
        }
    }

    public func queryExplain(_ query: String,
                      parameters: [String: Any]? = nil,
                      databaseName: String) throws -> String {
        do {
            guard let database = self.getDatabase(databaseName) else {
                throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
            }
            let query = try database.createQuery(query)
            if let params = parameters {
                let queryParams = try QueryHelper.getParamatersFromJson(params)
                query.parameters = queryParams
            }
            let results = try query.explain()
            return results
        } catch {
            throw QueryError.unknownError(message: error.localizedDescription)
        }
    }
}
