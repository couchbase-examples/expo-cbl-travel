//
//  CollectionManager.swift
//  CbliteSwiftJsLib
//
//  Created by Aaron LaBeau on 07/04/24.
//

import Foundation
import CouchbaseLiteSwift

public struct CollectionConfigItem: Codable {
    let collections: [CollectionDtoWrapper]
    let config: ConfigDto
}

public struct CollectionDtoWrapper: Codable {
    let collection: CollectionDto
}

public struct CollectionDto: Codable {
    let name: String
    let scopeName: String
    let databaseName: String
}

public struct ConfigDto: Codable {
    let channels: [String]
    let documentIds: [String]
}

public enum CollectionError: Error {
    case unableToFindCollection(collectionName: String, scopeName: String, databaseName: String)
    case getCollection(message: String, collectionName: String, scopeName: String, databaseName: String)
    case cannotCreateIndex(indexName: String)
    case createIndex(indexName: String, message: String)
    case unknownIndexType(indexType: String)
    case documentError(message: String, collectionName: String, scopeName: String, databaseName: String)
}

public class CollectionManager {
    
    private var defaultCollectionName: String = "_default"
    private var defaultScopeName: String = "_default"
    
    // MARK: - Private for management of state
    
    // index is based on databaseName.scopeName.collectionName
    var documentChangeListeners = [String: Any]()
    
    // MARK: - Singleton
    public static let shared = CollectionManager()
    
    // MARK: - Private initializer to prevent external instatiation
    private init() {
        
    }
    
    // MARK: - Helper Functions
    
    public func getCollection(_ collectionName: String,
                              scopeName: String,
                              databaseName: String) throws -> Collection? {
        guard let database = DatabaseManager.shared.getDatabase(databaseName) else {
            throw DatabaseError.invalidDatabaseName(databaseName: databaseName)
        }
        
        do {
            guard let collection = try database.collection(
                name: collectionName,
                scope: scopeName) else {
                throw CollectionError.unableToFindCollection(collectionName: collectionName, scopeName: scopeName, databaseName: databaseName)
            }
            return collection
        } catch {
            throw CollectionError.getCollection(message: error.localizedDescription, collectionName: collectionName, scopeName: scopeName, databaseName: databaseName)
        }
    }
    
    // MARK: Index Functions
    
    public func createIndex(_ indexName: String,
                            indexType: String,
                            items: [[Any]],
                            collectionName: String,
                            scopeName: String,
                            databaseName: String) throws {
        
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(collectionName: collectionName, scopeName: scopeName, databaseName: databaseName)
        }
        
        let index: Index
        switch indexType {
            case "value":
                index = IndexBuilder.valueIndex(items: IndexHelper.makeValueIndexItems(items))
            case "full-text":
                index = IndexBuilder.fullTextIndex(items: IndexHelper.makeFullTextIndexItems(items))
            default:
                throw CollectionError.unknownIndexType(indexType: indexType)
        }
        
        do {
            try collection.createIndex(index, name: indexName)
        } catch {
            throw CollectionError.createIndex(indexName: indexName, message: error.localizedDescription)
        }
    }
    
    public func deleteIndex(_ indexName: String,
                            collectionName: String,
                            scopeName: String,
                            databaseName: String) throws {
        
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        do {
            try collection.deleteIndex(forName: indexName)
        } catch {
            throw error
        }
    }
    
    public func indexes(_ collectionName: String,
                        scopeName: String,
                        databaseName: String) throws -> [String] {
        
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName),
              let indexes = try? collection.indexes() else {
            throw CollectionError.unableToFindCollection(collectionName: collectionName, scopeName: scopeName, databaseName: databaseName)
        }
        return indexes
    }
    
    // MARK: Document Functions
    
    public func documentsCount(_ collectionName: String,
                               scopeName: String,
                               databaseName: String) throws -> UInt64 {
        
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        return collection.count
    }
    
    public func saveDocument(_ documentId: String,
                             document: [String: Any],
                             concurrencyControl: ConcurrencyControl?,
                             collectionName: String,
                             scopeName: String,
                             databaseName: String) throws -> (String, Bool?) {
        
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        let mutableDocument: MutableDocument
        if !documentId.isEmpty {
            mutableDocument = MutableDocument(id: documentId, data: MapHelper.toMap(document))
        } else {
            mutableDocument = MutableDocument(data: MapHelper.toMap(document))
        }
        
        do {
            
            if let concurrencyControlValue = concurrencyControl {
                let results = try collection.save(document: mutableDocument, concurrencyControl: concurrencyControlValue)
                if results {
                    return (mutableDocument.id, true)
                }
                return (mutableDocument.id, false)
            } else {
                try collection.save(document: mutableDocument)
                return (documentId, nil)
            }
        } catch {
            throw CollectionError.documentError(
                message: error.localizedDescription,
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
    }
    
    public func document(_ documentId: String,
                         collectionName: String,
                         scopeName: String,
                         databaseName: String) throws -> Document? {
        
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        do {
            let document =  try collection.document(id: documentId)
            return document
        } catch {
            throw CollectionError.documentError(
                message: error.localizedDescription,
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
    }
    
    public func getBlobContent(_ key: String,
                               documentId: String,
                               collectionName: String,
                               scopeName: String,
                               databaseName: String) throws -> [Int]? {
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        
        guard let document = try collection.document(id: documentId) else {
            throw CollectionError.documentError(message: "can't find document", collectionName: collectionName, scopeName: scopeName, databaseName: databaseName)
        }
        
        guard let blob = document.blob(forKey: key) else {
            return []
        }
        
        if let data = blob.content {
            var content: [Int] = []
            data.regions.forEach { region in
                for byte in region {
                    content.append(Int(byte))
                }
            }
            return content
        }
        return []
    }
    
    public func deleteDocument(_ documentId: String,
                               collectionName: String,
                               scopeName: String,
                               databaseName: String) throws {
        
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        do {
            guard let document =  try collection.document(id: documentId) else {
                throw CollectionError.documentError(
                    message: "Document not found with id: \(documentId)",
                    collectionName: collectionName,
                    scopeName: scopeName,
                    databaseName: databaseName)
            }
            try collection.delete(document: document)
        } catch {
            throw CollectionError.documentError(
                message: error.localizedDescription,
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
    }
    
    public func deleteDocument(_ documentId: String,
                               concurrencyControl: ConcurrencyControl?,
                               collectionName: String,
                               scopeName: String,
                               databaseName: String) throws -> String {
        
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        do {
            guard let document =  try collection.document(id: documentId) else {
                throw CollectionError.documentError(
                    message: "Document not found with id: \(documentId)",
                    collectionName: collectionName,
                    scopeName: scopeName,
                    databaseName: databaseName)
            }
            if let cc = concurrencyControl {
                let result = try collection.delete(document: document, concurrencyControl: cc)
                if result {
                    return "true"
                }
                return "false"
            } else {
                try collection.delete(document: document)
                return ""
            }
            
        } catch {
            throw CollectionError.documentError(
                message: error.localizedDescription,
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
    }
    
    public func purgeDocument(_ documentId: String,
                              collectionName: String,
                              scopeName: String,
                              databaseName: String) throws {
        
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        do {
            try collection.purge(id: documentId)
        } catch {
            throw CollectionError.documentError(
                message: error.localizedDescription,
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
    }
    
    public func setDocumentExpiration(_ documentId: String,
                                      expiration: Date?,
                                      collectionName: String,
                                      scopeName: String,
                                      databaseName: String) throws {
        
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        do {
            try collection.setDocumentExpiration(
                id: documentId,
                expiration: expiration)
        } catch {
            throw CollectionError.documentError(
                message: error.localizedDescription,
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        
    }
    
    public func getDocumentExpiration(_ documentId: String,
                                      collectionName: String,
                                      scopeName: String,
                                      databaseName: String) throws -> Date? {
        
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName) else {
            throw CollectionError.unableToFindCollection(
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        do {
            let result = try collection.getDocumentExpiration(id: documentId)
            return result
        } catch {
            throw CollectionError.documentError(
                message: error.localizedDescription,
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
        
    }
}
