//
//  CollectionManager.swift
//  CbliteSwiftJsLib
//

import Foundation
import CouchbaseLiteSwift


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - NEW API Data Transfer Objects (Following iOS Native SDK Pattern)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/// **NEW API** - Data Transfer Object for collection configuration
///
/// **What it does:**
/// - Represents a SINGLE collection paired with its specific replication configuration
/// - Matches iOS native SDK pattern where each CollectionConfiguration knows its collection
/// - Allows different collections to have different configurations
///
/// **Structure:**
/// - `collection`: Single collection (NOT an array)
/// - `config`: Configuration for THIS specific collection (optional, can be nil for defaults)
///
/// **Example JSON received from JavaScript:**
/// ```json
/// [
///   {
///     "collection": {"name": "users", "scopeName": "_default", "databaseName": "mydb"},
///     "config": {
///       "channels": ["public"],
///       "documentIds": [],
///       "pushFilter": null,
///       "pullFilter": null
///     }
///   },
///   {
///     "collection": {"name": "orders", "scopeName": "_default", "databaseName": "mydb"},
///     "config": {
///       "channels": ["orders", "admin"],
///       "documentIds": ["order-1", "order-2"],
///       "pushFilter": "(doc, flags) => { return doc.type === 'order'; }",
///       "pullFilter": null
///     }
///   },
///   {
///     "collection": {"name": "products", "scopeName": "_default", "databaseName": "mydb"},
///     "config": null
///   }
/// ]
/// ```
///
/// **Benefits:**
/// - "users" gets channels: ["public"]
/// - "orders" gets channels: ["orders", "admin"] AND documentIds filter AND push filter
/// - "products" uses default configuration (no filters, all documents)
/// - Each collection has independent configuration
///
/// **Usage in ReplicatorHelper:**
/// ```swift
/// let collectionConfigs = try buildCollectionConfigurations(dtoArray)
/// let replConfig = ReplicatorConfiguration(collections: collectionConfigs, target: endpoint)
/// ```
public struct CollectionConfigurationDto: Codable {
    let collection: CollectionDto
    let config: ConfigDto?
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - OLD API Data Transfer Objects (For Backward Compatibility)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/// **OLD API** - Data Transfer Object for collection configuration (DEPRECATED)
///
/// **What it does:**
/// - Represents MULTIPLE collections that share ONE configuration
/// - Legacy pattern from before iOS 3.1
/// - Maintained for backward compatibility
///
/// **Structure:**
/// - `collections`: Array of collections (wrapped in CollectionDtoWrapper)
/// - `config`: Single shared configuration for ALL collections
///
/// **Example JSON received from JavaScript (OLD API):**
/// ```json
/// [
///   {
///     "collections": [
///       {"collection": {"name": "users", "scopeName": "_default", "databaseName": "mydb"}},
///       {"collection": {"name": "orders", "scopeName": "_default", "databaseName": "mydb"}}
///     ],
///     "config": {
///       "channels": ["public"],
///       "documentIds": [],
///       "pushFilter": null,
///       "pullFilter": null
///     }
///   }
/// ]
/// ```
///
/// **Migration to NEW API:**
/// Use `CollectionConfigurationDto` instead, where each collection has its own config.
///
/// @deprecated Use {@link CollectionConfigurationDto} instead
public struct CollectionConfigItem: Codable {
    let collections: [CollectionDtoWrapper]
    let config: ConfigDto
}

/// Wrapper for collection in OLD API format
public struct CollectionDtoWrapper: Codable {
    let collection: CollectionDto
}


/// Collection identifier Data Transfer Object
///
/// **What it does:**
/// - Identifies a specific collection within a database
/// - Used to locate the collection in CollectionManager
///
/// **Parameters:**
/// - `name`: Collection name (e.g., "users", "orders")
/// - `scopeName`: Scope name (e.g., "_default" or custom scope)
/// - `databaseName`: Database name (e.g., "mydb")
///
/// **Example JSON:**
/// ```json
/// {
///   "name": "users",
///   "scopeName": "_default",
///   "databaseName": "mydb"
/// }
/// ```
///
/// **Example Swift struct:**
/// ```swift
/// CollectionDto(name: "users", scopeName: "_default", databaseName: "mydb")
/// ```
public struct CollectionDto: Codable {
    let name: String
    let scopeName: String
    let databaseName: String
}

/// Replication configuration settings Data Transfer Object
///
/// **What it does:**
/// - Contains all configuration settings for replicating a collection
/// - Specifies channels, document filters, and replication filters
///
/// **Parameters:**
/// - `channels`: Array of Sync Gateway channel names to pull from (pull replication only)
/// - `documentIds`: Array of specific document IDs to replicate (filters which docs to sync)
/// - `pushFilter`: JavaScript function string to filter which documents to push
/// - `pullFilter`: JavaScript function string to filter which documents to pull
///
/// **Example JSON:**
/// ```json
/// {
///   "channels": ["public", "user-123"],
///   "documentIds": ["doc-1", "doc-2", "doc-3"],
///   "pushFilter": "(doc, flags) => { return doc.type === 'user' && !flags.includes('DELETED'); }",
///   "pullFilter": "(doc, flags) => { return doc.verified === true; }"
/// }
/// ```
///
/// **Example Swift struct:**
/// ```swift
/// ConfigDto(
///     channels: ["public", "user-123"],
///     documentIds: ["doc-1", "doc-2"],
///     pushFilter: "(doc, flags) => { return doc.type === 'user'; }",
///     pullFilter: nil
/// )
/// ```
///
/// **Notes:**
/// - All fields are optional (defaults to empty arrays and nil filters)
/// - Channels are ignored for push replication
/// - Filters are JavaScript function strings that get evaluated at runtime
public struct ConfigDto: Codable {
    let channels: [String]
    let documentIds: [String]
    let pushFilter: String?
    let pullFilter: String?

    enum CodingKeys: String, CodingKey {
        case channels, documentIds, pushFilter, pullFilter
    }
    
    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        channels = try container.decodeIfPresent([String].self, forKey: .channels) ?? []
        documentIds = try container.decodeIfPresent([String].self, forKey: .documentIds) ?? []
        pushFilter = try container.decodeIfPresent(String.self, forKey: .pushFilter)
        pullFilter = try container.decodeIfPresent(String.self, forKey: .pullFilter)
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(channels, forKey: .channels)
        try container.encode(documentIds, forKey: .documentIds)
        try container.encodeIfPresent(pushFilter, forKey: .pushFilter)
        try container.encodeIfPresent(pullFilter, forKey: .pullFilter)
    }
}

public struct DocumentDto: Codable {
    let document: String
    let blobs: String
}

public struct CollectionDocumentResult {
    let id: String
    let revId: String?
    let sequence: UInt64
    let concurrencyControl: Bool?
}

public enum CollectionError: Error, LocalizedError {
    case unableToFindCollection(collectionName: String, scopeName: String, databaseName: String)
    case getCollection(message: String, collectionName: String, scopeName: String, databaseName: String)
    case cannotCreateIndex(indexName: String)
    case createIndex(indexName: String, message: String)
    case unknownIndexType(indexType: String)
    case documentError(message: String, collectionName: String, scopeName: String, databaseName: String)
    case randomError(message: String, collectionName: String, scopeName: String, databaseName: String)
    case databaseNotOpen(name: String)
    
    public var errorDescription: String? {
        switch self {
        case .unableToFindCollection(let collectionName, let scopeName, let databaseName):
            return "Unable to find collection '\(collectionName)' in scope '\(scopeName)' of database '\(databaseName)'"
        case .getCollection(let message, let collectionName, let scopeName, let databaseName):
            return "Error getting collection '\(collectionName)' in scope '\(scopeName)' of database '\(databaseName)': \(message)"
        case .cannotCreateIndex(let indexName):
            return "Cannot create index '\(indexName)'"
        case .createIndex(let indexName, let message):
            return "Error creating index '\(indexName)': \(message)"
        case .unknownIndexType(let indexType):
            return "Unknown index type: '\(indexType)'"
        case .documentError(let message, let collectionName, let scopeName, let databaseName):
            return "Document error in collection '\(collectionName)' (scope: '\(scopeName)', database: '\(databaseName)'): \(message)"
        case .randomError(let message, let collectionName, let scopeName, let databaseName):
            return "Error in collection '\(collectionName)' (scope: '\(scopeName)', database: '\(databaseName)'): \(message)"
        case .databaseNotOpen(let name):
            return "Database '\(name)' is not open"
        }
    }
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
    
    /// Converts a JSON string containing blob data into a dictionary of Blob objects
    ///
    /// **What it does:**
    /// - Parses JSON string from JavaScript containing blob information
    /// - Converts blob metadata and byte arrays into native iOS Blob objects
    /// - Used when saving documents with binary attachments from React Native
    ///
    /// **Parameters:**
    /// - `value`: JSON string containing blob data
    ///
    /// **Example parameter:**
    /// ```json
    /// {
    ///   "avatar": {
    ///     "_type": "blob",
    ///     "data": {
    ///       "contentType": "image/png",
    ///       "data": [137, 80, 78, 71, 13, 10, 26, 10, ...]
    ///     }
    ///   },
    ///   "document": {
    ///     "_type": "blob",
    ///     "data": {
    ///       "contentType": "application/pdf",
    ///       "data": [37, 80, 68, 70, ...]
    ///     }
    ///   }
    /// }
    /// ```
    ///
    /// **Returns:**
    /// - `[String: Blob]`: Dictionary mapping blob keys to iOS native Blob objects
    ///
    /// **Example return value:**
    /// ```swift
    /// [
    ///   "avatar": Blob(contentType: "image/png", data: Data(...)),
    ///   "document": Blob(contentType: "application/pdf", data: Data(...))
    /// ]
    /// ```
    ///
    /// **Returns empty dictionary if:**
    /// - Input string is empty
    /// - Input string is "[]"
    /// - JSON parsing fails
    /// - No valid blobs found in JSON
    ///
    /// **Throws:**
    /// - JSON parsing errors if JSON is malformed
    public func blobsFromJsonString(_ value: String) throws -> [String: Blob] {
        var blobs = [String: Blob]()
        if (value.isEmpty || value == "[]") {
            return blobs
        }
        do {
            if let data = value.data(using: .utf8) {
                if let map = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                    for (key, value) in map {
                        if let object = value as? [String: Any],
                           let type = object["_type"] as? String, type == "blob" {
                            if let blobData = object["data"] as? [String: Any],
                               let contentType = blobData["contentType"] as? String,
                               let bytes = blobData["data"] as? [NSNumber] {
                                
                                var bytesCArray = [UInt8](repeating: 0, count: bytes.count)
                                for (index, byte) in bytes.enumerated() {
                                    bytesCArray[index] = byte.uint8Value
                                }
                                
                                let data = Data(bytesCArray)
                                let blob = Blob(contentType: contentType, data: data)
                                blobs[key] = blob
                                continue
                            }
                        }
                    }
                }
            }
        } catch {
           throw error
        }
        return blobs
    }
    
    /// Retrieves a Collection object from the database
    ///
    /// **What it does:**
    /// - Looks up a database by name using DatabaseManager
    /// - Retrieves the specified collection within the database's scope
    /// - Core function used by all collection operations
    ///
    /// **Parameters:**
    /// - `collectionName`: Name of the collection (e.g., "users", "orders")
    /// - `scopeName`: Name of the scope (e.g., "_default")
    /// - `databaseName`: Name of the database (e.g., "mydb")
    ///
    /// **Example parameters:**
    /// ```swift
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `Collection?`: iOS native Collection object if found
    /// - `nil`: If collection doesn't exist in the scope
    ///
    /// **Example return value:**
    /// ```swift
    /// Collection(name: "users", scope: Scope(name: "_default"), database: Database(name: "mydb"))
    /// ```
    ///
    /// **Throws:**
    /// - `DatabaseError.invalidDatabaseName`: If database doesn't exist
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    /// - `CollectionError.getCollection`: If any other error occurs during retrieval
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
    
    /// Creates an index on a collection to optimize query performance
    ///
    /// **What it does:**
    /// - Creates either a value index or full-text index on specified fields
    /// - Value indexes: For faster WHERE clause queries on specific properties
    /// - Full-text indexes: For text search queries using MATCH()
    ///
    /// **Parameters:**
    /// - `indexName`: Unique name for the index (e.g., "idx_user_email")
    /// - `indexType`: Type of index - "value" or "full-text"
    /// - `items`: Array of property paths to index
    /// - `collectionName`: Collection to create index in
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters (Value Index):**
    /// ```swift
    /// indexName: "idx_user_email"
    /// indexType: "value"
    /// items: [["email"], ["created_at"]]
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Example parameters (Full-Text Index):**
    /// ```swift
    /// indexName: "idx_product_search"
    /// indexType: "full-text"
    /// items: [["name"], ["description"]]
    /// collectionName: "products"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `Void` (index is created on the collection)
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    /// - `CollectionError.unknownIndexType`: If indexType is not "value" or "full-text"
    /// - `CollectionError.createIndex`: If index creation fails (e.g., index already exists)
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
    
    /// Deletes an existing index from a collection
    ///
    /// **What it does:**
    /// - Removes a previously created index from the collection
    /// - Frees up storage space used by the index
    /// - Queries will no longer benefit from this index
    ///
    /// **Parameters:**
    /// - `indexName`: Name of the index to delete
    /// - `collectionName`: Collection containing the index
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters:**
    /// ```swift
    /// indexName: "idx_user_email"
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `Void` (index is deleted)
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    /// - Other errors from iOS native SDK if index deletion fails
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
    
    /// Returns a list of all index names in a collection
    ///
    /// **What it does:**
    /// - Retrieves names of all indexes created on the collection
    /// - Useful for auditing and debugging query performance
    ///
    /// **Parameters:**
    /// - `collectionName`: Collection to list indexes from
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters:**
    /// ```swift
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `[String]`: Array of index names
    ///
    /// **Example return value:**
    /// ```swift
    /// ["idx_user_email", "idx_user_created_at", "idx_user_search"]
    /// ```
    ///
    /// **Returns empty array if:**
    /// - No indexes exist on the collection
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist or error retrieving indexes
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
    
    /// Deletes a document from a collection (simple version without concurrency control)
    ///
    /// **What it does:**
    /// - Permanently deletes a document from the collection
    /// - Document can still be recovered via replication if not purged on server
    /// - Creates a tombstone revision to track the deletion
    ///
    /// **Parameters:**
    /// - `documentId`: ID of the document to delete
    /// - `collectionName`: Collection containing the document
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters:**
    /// ```swift
    /// documentId: "user::123"
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `Void` (document is deleted)
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    /// - `CollectionError.documentError`: If document doesn't exist or deletion fails
    ///
    /// **Note:** For optimistic locking, use the overload with `concurrencyControl` parameter
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
    
    /// Deletes a document from a collection with optional optimistic locking
    ///
    /// **What it does:**
    /// - Deletes a document with concurrency control for safe multi-user operations
    /// - Uses optimistic locking to prevent conflicting deletions
    /// - Returns whether deletion succeeded or failed due to conflict
    ///
    /// **Parameters:**
    /// - `documentId`: ID of the document to delete
    /// - `concurrencyControl`: Locking strategy (.lastWriteWins or .failOnConflict)
    /// - `collectionName`: Collection containing the document
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters:**
    /// ```swift
    /// documentId: "user::123"
    /// concurrencyControl: .failOnConflict  // Fail if document changed
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `String`: Result of deletion operation
    ///   - `"true"`: Deletion succeeded
    ///   - `"false"`: Deletion failed due to conflict
    ///   - `""`: Empty string if concurrencyControl is nil (deletion succeeded)
    ///
    /// **Example return values:**
    /// ```swift
    /// "true"   // Successfully deleted
    /// "false"  // Failed: document was modified by another operation
    /// ""       // No concurrency control, deletion successful
    /// ```
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    /// - `CollectionError.documentError`: If document doesn't exist or deletion fails
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
    
    /// Retrieves a document from a collection by ID
    ///
    /// **What it does:**
    /// - Fetches a document from the collection
    /// - Returns the current state of the document
    /// - Returns nil if document doesn't exist (not an error)
    ///
    /// **Parameters:**
    /// - `documentId`: ID of the document to retrieve
    /// - `collectionName`: Collection containing the document
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters:**
    /// ```swift
    /// documentId: "user::123"
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `Document?`: iOS native Document object if found
    /// - `nil`: If document doesn't exist
    ///
    /// **Example return value:**
    /// ```swift
    /// Document(
    ///   id: "user::123",
    ///   properties: ["name": "John", "email": "john@example.com", "age": 30],
    ///   revisionID: "2-abc123",
    ///   sequence: 42
    /// )
    /// ```
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    /// - `CollectionError.documentError`: If retrieval fails (but not if document doesn't exist)
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
    
    /// Returns the total number of documents in a collection
    ///
    /// **What it does:**
    /// - Gets the count of all documents in the collection
    /// - Includes deleted documents (tombstones) until they're purged
    /// - Fast O(1) operation
    ///
    /// **Parameters:**
    /// - `collectionName`: Collection to count documents in
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters:**
    /// ```swift
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `UInt64`: Total number of documents
    ///
    /// **Example return values:**
    /// ```swift
    /// 0      // Empty collection
    /// 1000   // Collection with 1000 documents
    /// ```
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
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
    
    /// Gets the expiration date/time for a document
    ///
    /// **What it does:**
    /// - Retrieves when a document is scheduled to be automatically deleted
    /// - Returns nil if no expiration is set
    /// - Documents are purged automatically after expiration
    ///
    /// **Parameters:**
    /// - `documentId`: ID of the document to check
    /// - `collectionName`: Collection containing the document
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters:**
    /// ```swift
    /// documentId: "session::abc123"
    /// collectionName: "sessions"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `Date?`: Expiration date/time
    /// - `nil`: If no expiration set
    ///
    /// **Example return values:**
    /// ```swift
    /// Date("2024-12-31T23:59:59Z")  // Expires on Dec 31, 2024
    /// nil                            // No expiration
    /// ```
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    /// - `CollectionError.documentError`: If unable to get expiration
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
    
    /// Retrieves the binary content of a blob attachment
    ///
    /// **What it does:**
    /// - Gets the blob data from a document property
    /// - Returns blob content as array of bytes
    /// - Used to extract binary attachments (images, PDFs, etc.)
    ///
    /// **Parameters:**
    /// - `key`: Property name containing the blob
    /// - `documentId`: ID of the document containing the blob
    /// - `collectionName`: Collection containing the document
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters:**
    /// ```swift
    /// key: "avatar"
    /// documentId: "user::123"
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `[Int]?`: Array of byte values (0-255) representing the blob data
    /// - `[]`: Empty array if blob doesn't exist or has no content
    ///
    /// **Example return value:**
    /// ```swift
    /// [137, 80, 78, 71, 13, 10, 26, 10, ...]  // PNG image bytes
    /// []                                       // No blob found
    /// ```
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    /// - `CollectionError.documentError`: If document doesn't exist
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
    
    /// Permanently removes a document from the local database
    ///
    /// **What it does:**
    /// - Completely removes document and all its revisions
    /// - Cannot be recovered or synced back from server
    /// - More permanent than delete (which creates tombstone)
    /// - Use for GDPR compliance or truly removing sensitive data
    ///
    /// **Parameters:**
    /// - `documentId`: ID of the document to purge
    /// - `collectionName`: Collection containing the document
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters:**
    /// ```swift
    /// documentId: "user::123"
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `Void` (document is purged)
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    /// - `CollectionError.documentError`: If purge fails
    ///
    /// **Warning:** Purged documents cannot be recovered and won't sync back from server!
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
    
    /// Saves or updates a document in a collection with optional blob attachments
    ///
    /// **What it does:**
    /// - Creates a new document or updates an existing one
    /// - Supports JSON document data and binary blob attachments
    /// - Optional optimistic locking for safe concurrent updates
    /// - Returns document metadata (ID, revision, sequence)
    ///
    /// **Parameters:**
    /// - `documentId`: ID for the document (empty string = auto-generate)
    /// - `document`: JSON string containing document properties
    /// - `blobs`: Dictionary of blob attachments (key = property name, value = Blob)
    /// - `concurrencyControl`: Optional locking strategy (.lastWriteWins or .failOnConflict)
    /// - `collectionName`: Collection to save document in
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters (New Document):**
    /// ```swift
    /// documentId: ""  // Auto-generate
    /// document: """
    ///   {
    ///     "name": "John Doe",
    ///     "email": "john@example.com",
    ///     "age": 30,
    ///     "verified": true
    ///   }
    /// """
    /// blobs: [:]  // No blobs
    /// concurrencyControl: nil
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Example parameters (Update with Blob):**
    /// ```swift
    /// documentId: "user::123"
    /// document: """{"name": "John Doe", "email": "john@example.com"}"""
    /// blobs: ["avatar": Blob(contentType: "image/png", data: avatarData)]
    /// concurrencyControl: .failOnConflict
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `CollectionDocumentResult`: Struct containing save operation result
    ///
    /// **Example return value:**
    /// ```swift
    /// CollectionDocumentResult(
    ///   id: "user::123",                    // Document ID (generated if empty)
    ///   revId: "2-abc123def456",            // New revision ID
    ///   sequence: 42,                        // Sequence number in collection
    ///   concurrencyControl: true            // true=saved, false=conflict, nil=not used
    /// )
    /// ```
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    /// - `CollectionError.documentError`: If save fails or JSON is invalid
    public func saveDocument(_ documentId: String,
                             document: String,
                             blobs: [String: Blob],
                             concurrencyControl: ConcurrencyControl?,
                             collectionName: String,
                             scopeName: String,
                             databaseName: String) throws -> CollectionDocumentResult {
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
            //create the document
            let mutableDocument: MutableDocument
            if !documentId.isEmpty {
                mutableDocument = try MutableDocument(id: documentId, json: document)
            } else {
                mutableDocument = try MutableDocument(json: document)
            }

            //update the document with the blobs
            for (key, blob) in blobs {
                mutableDocument.setBlob(blob, forKey: key)
            }

            if let concurrencyControlValue = concurrencyControl {
                let results = try collection.save(document: mutableDocument, concurrencyControl: concurrencyControlValue)
                if results {
                    return CollectionDocumentResult(
                        id: mutableDocument.id,
                        revId:  mutableDocument.revisionID,
                        sequence: mutableDocument.sequence,
                        concurrencyControl: true)
                    
                }
                return CollectionDocumentResult(
                    id: mutableDocument.id,
                    revId:  mutableDocument.revisionID,
                    sequence: mutableDocument.sequence,
                    concurrencyControl: false)
            } else {
                try collection.save(document: mutableDocument)
                return CollectionDocumentResult(
                    id: mutableDocument.id,
                    revId:  mutableDocument.revisionID,
                    sequence: mutableDocument.sequence,
                    concurrencyControl: nil)
            }
        } catch {
            throw CollectionError.documentError(
                message: error.localizedDescription,
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName)
        }
    }
    
    /// Sets or removes the expiration date/time for a document
    ///
    /// **What it does:**
    /// - Schedules a document for automatic deletion at a future time
    /// - Pass nil to remove expiration
    /// - Document is automatically purged when expiration time arrives
    /// - Useful for temporary data like sessions, cache, or time-limited content
    ///
    /// **Parameters:**
    /// - `documentId`: ID of the document to set expiration for
    /// - `expiration`: Date/time when document should expire (nil = remove expiration)
    /// - `collectionName`: Collection containing the document
    /// - `scopeName`: Scope containing the collection
    /// - `databaseName`: Database containing the scope
    ///
    /// **Example parameters (Set Expiration):**
    /// ```swift
    /// documentId: "session::abc123"
    /// expiration: Date(timeIntervalSinceNow: 3600)  // Expire in 1 hour
    /// collectionName: "sessions"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Example parameters (Remove Expiration):**
    /// ```swift
    /// documentId: "session::abc123"
    /// expiration: nil  // Remove expiration, keep document indefinitely
    /// collectionName: "sessions"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `Void` (expiration is set or removed)
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    /// - `CollectionError.documentError`: If setting expiration fails
    ///
    /// **Note:** Expired documents are purged automatically, not just deleted (no tombstone)
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

    /// Returns the fully qualified name of a collection
    ///
    /// **What it does:**
    /// - Gets the full name in format: "<scopeName>.<collectionName>"
    /// - Useful for display and logging purposes
    /// - Includes scope to distinguish collections with same name in different scopes
    ///
    /// **Parameters:**
    /// - `collectionName`: Name of the collection
    /// - `scopeName`: Name of the scope
    /// - `databaseName`: Name of the database
    ///
    /// **Example parameters:**
    /// ```swift
    /// collectionName: "users"
    /// scopeName: "_default"
    /// databaseName: "mydb"
    /// ```
    ///
    /// **Returns:**
    /// - `String`: Fully qualified collection name
    ///
    /// **Example return values:**
    /// ```swift
    /// "_default.users"           // Collection "users" in default scope
    /// "production.orders"        // Collection "orders" in "production" scope
    /// "testing._default"         // Default collection in "testing" scope
    /// ```
    ///
    /// **Throws:**
    /// - `CollectionError.unableToFindCollection`: If collection doesn't exist
    ///
    /// **Usage:**
    /// Useful for logging, debugging, and displaying collection information to users
    public func fullName(_ collectionName: String, scopeName: String, databaseName: String) throws -> String{
        guard let collection = try self.getCollection(
            collectionName,
            scopeName: scopeName,
            databaseName: databaseName
        ) else {
            throw CollectionError.unableToFindCollection(
                collectionName: collectionName,
                scopeName: scopeName,
                databaseName: databaseName
            )
        }

        // do {
            return collection.fullName
        // }
        // catch{
        //     throw CollectionError.randomError(message: "Error getting the full name", collectionName: collectionName, scopeName: scopeName, databaseName: databaseName)
        // } 
    }
}
