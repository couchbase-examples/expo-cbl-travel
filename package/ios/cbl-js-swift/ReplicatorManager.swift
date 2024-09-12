//
//  ReplicatorManager.swift
//  CbliteSwiftJsLib
//
//  Created by Aaron LaBeau on 09/04/24.
//

import Foundation
import CouchbaseLiteSwift

enum ReplicatorError: Error {
    case configurationError(message: String)
    case unableToFindReplicator(replicatorId: String)
    case unknownError(message: String)
    case fatalError(message: String)
    case invalidState(message: String)
}

public class ReplicatorManager {

    /* replicators tracking */
    var replicators = [String: Replicator]()
    var replicatorChangeListeners = [String: Any]()
    var replicatorDocumentListeners = [String: Any]()

    // MARK: - Singleton
    public static let shared = ReplicatorManager()

    // MARK: - Private initializer to prevent external instatiation
    private init() { }

    // MARK: - Helper Functions
    public func getReplicator(replicatorId: String) -> Replicator? {
        return self.replicators[replicatorId]
    }
    
    public func removeReplicator(replicatorId: String) {
        self.replicators.removeValue(forKey: replicatorId)
    }

    // MARK: Replicator Functions

    public func replicator(_ replicatorConfig: [String: Any], collectionConfiguration: [CollectionConfigItem]) throws -> String {
            let id = UUID().uuidString
            let config = try ReplicatorHelper.replicatorConfigFromJson(replicatorConfig, collectionConfiguration: collectionConfiguration)
        
            let replicator = Replicator(config: config)
            replicators[id] = replicator
            return id
    }

    public func start(_ replicatorId: String) throws {
        if let replicator = getReplicator(replicatorId: replicatorId) {
            replicator.start()
        } else {
            throw ReplicatorError.unableToFindReplicator(replicatorId: replicatorId)
        }
    }

    public func stop(_ replicatorId: String) throws {
        if let replicator = getReplicator(replicatorId: replicatorId) {
            replicator.stop()
        } else {
            throw ReplicatorError.unableToFindReplicator(replicatorId: replicatorId)
        }
    }

    public func resetCheckpoint(_ replicatorId: String) throws {
        if let replicator = getReplicator(replicatorId: replicatorId) {
            let status = replicator.status
            let activity = status.activity
            if activity == .stopped || activity == .idle {
                replicator.start(reset: true)
            } else {
                throw ReplicatorError.invalidState(message: "replicator is in an invalid state to reset checkpoint: \(activity)")
            }
        } else {
            throw ReplicatorError.unableToFindReplicator(replicatorId: replicatorId)
        }
    }

    public func getStatus(_ replicatorId: String) throws -> [String: Any] {
        if let replicator = getReplicator(replicatorId: replicatorId) {
            let status = replicator.status
            let statusJson = ReplicatorHelper.generateReplicatorStatusJson(status)
            return statusJson
        } else {
            throw ReplicatorError.unableToFindReplicator(replicatorId: replicatorId)
        }
    }
    
    public func getPendingDocumentIds(_ replicatorId: String, collection: Collection) throws ->  [String:Any] {
        if let replicator = getReplicator(replicatorId: replicatorId) {
            do {
                let documentIds = try replicator.pendingDocumentIds(collection: collection)
                let stringArray = Array(documentIds)
                return ["pendingDocumentIds": stringArray];
            } catch {
                throw error
            }
        } else {
            throw ReplicatorError.unableToFindReplicator(replicatorId: replicatorId)
        }
    }
    
    public func isDocumentPending(_ replicatorId: String, documentId: String, collection: Collection) throws ->  [String:Any] {
        if let replicator = getReplicator(replicatorId: replicatorId) {
            do {
                let isPending = try replicator.isDocumentPending(documentId, collection: collection)
                return ["isPending": isPending];
            } catch {
                throw error
            }
        } else {
            throw ReplicatorError.unableToFindReplicator(replicatorId: replicatorId)
        }
    }

    public func cleanUp(_ replicatorId: String) throws {
        if let replicator = getReplicator(replicatorId: replicatorId) {
            replicator.stop()
            self.replicators.removeValue(forKey: replicatorId)
        } else {
            throw ReplicatorError.unableToFindReplicator(replicatorId: replicatorId)
        }
    }
    
    public func pendingDocIds(_ replicatorId: String, collectionName: String, scopeName: String, databaseName: String) throws -> Set<String> {
        guard let collection = try CollectionManager.shared.getCollection(collectionName, scopeName: scopeName, databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(collectionName: collectionName, scopeName: scopeName, databaseName: databaseName)
        }
        guard let replicator = self.getReplicator(replicatorId: replicatorId) else {
            throw ReplicatorError.unableToFindReplicator(replicatorId: replicatorId)
        }
        do {
            let docIds = try replicator.pendingDocumentIds(collection: collection)
            return docIds
        } catch {
            throw error
        }
    }
    
    public func isDocumentPending(_ documentId: String, replicatorId: String, collectionName: String, scopeName: String, databaseName: String) throws -> Bool {
        guard let collection = try CollectionManager.shared.getCollection(collectionName, scopeName: scopeName, databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(collectionName: collectionName, scopeName: scopeName, databaseName: databaseName)
        }
        guard let replicator = self.getReplicator(replicatorId: replicatorId) else {
            throw ReplicatorError.unableToFindReplicator(replicatorId: replicatorId)
        }
        do {
            let isPending = try replicator.isDocumentPending(documentId, collection: collection)
            return isPending
        } catch {
            throw error
        }
    }
}
