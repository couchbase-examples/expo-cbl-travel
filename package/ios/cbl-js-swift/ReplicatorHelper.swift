//
//  ReplicatorHelper.swift
//  CbliteSwiftJsLib
//
//  Created by Aaron LaBeau on 07/04/24.
//

import Foundation
import JavaScriptCore
import CouchbaseLiteSwift

public struct ReplicatorHelper {
    
    public static func replicatorConfigFromJson(_ data: [String: Any], collectionConfiguration: [CollectionConfigItem]) throws -> ReplicatorConfiguration {
       guard let target = data["target"] as? [String: Any],
              let url = target["url"] as? String,
              let replicatorType = data["replicatorType"] as? String,
              let continuous = data["continuous"] as? Bool,
              let acceptParentDomainCookies = data["acceptParentDomainCookies"] as? Bool,
              let acceptSelfSignedCerts = data["acceptSelfSignedCerts"] as? Bool,
              let allowReplicationInBackground = data["allowReplicationInBackground"] as? Bool,
              let autoPurgeEnabled = data["autoPurgeEnabled"] as? Bool,
              let heartbeat = data["heartbeat"] as? NSNumber,
              let maxAttempts = data["maxAttempts"] as? NSNumber,
              let maxAttemptWaitTime = data["maxAttemptWaitTime"] as? NSNumber
        else {
            throw ReplicatorError.fatalError(message: "Invalid JSON data")
        }
        
        let endpoint = URLEndpoint(url: URL(string: url)!)
        
        //set values from data
        var replConfig = ReplicatorConfiguration(target: endpoint)
        replConfig.acceptParentDomainCookie = acceptSelfSignedCerts
        replConfig.acceptParentDomainCookie = acceptParentDomainCookies
        replConfig.allowReplicatingInBackground = allowReplicationInBackground
        replConfig.continuous = continuous
        replConfig.enableAutoPurge = autoPurgeEnabled
    
        replConfig.heartbeat = TimeInterval(exactly: heartbeat.int64Value) ?? 300
        replConfig.maxAttemptWaitTime = TimeInterval(exactly: maxAttemptWaitTime.int64Value) ?? 0
        replConfig.maxAttempts = maxAttempts.uintValue
        
        //check for headers
        if let headers = data["headers"] as? [String: String] {
            replConfig.headers = headers
        }
        
        if let authenticatorData = data["authenticator"], !(authenticatorData is String && authenticatorData as! String == "")  {
            if let authenticatorConfig = authenticatorData as? [String: Any] {
                if let authenticator = ReplicatorHelper.replicatorAuthenticatorFromConfig(authenticatorConfig) {
                    replConfig.authenticator = authenticator
                }
            }
            
        }
        
       try  ReplicatorHelper.replicatorCollectionConfigFromJson(collectionConfiguration, replicationConfig:  &replConfig)
        
        switch replicatorType {
            case "PUSH_AND_PULL":
                replConfig.replicatorType = .pushAndPull
            case "PULL":
                replConfig.replicatorType = .pull
            case "PUSH":
                replConfig.replicatorType = .push
            default:
                throw ReplicatorError.fatalError(message: "Invalid replicatorType")
        }
        return replConfig
    }
    
    public static func replicatorCollectionConfigFromJson(_ data:  [CollectionConfigItem], replicationConfig: inout ReplicatorConfiguration) throws {
        
        //work on the collections sent in as part of the configuration with an array of collectionName, scopeName, and databaseName
        for item in data {
            
            var collections: [Collection] = []
            
            for col in item.collections {
                
                guard let collection = try CollectionManager.shared.getCollection(col.collection.name, scopeName: col.collection.scopeName, databaseName: col.collection.databaseName) else {
                    throw CollectionError.unableToFindCollection(collectionName: col.collection.name, scopeName: col.collection.scopeName, databaseName: col.collection.databaseName)
                }
                collections.append(collection)
            }
            
            //process the config part of the data
            var collectionConfig = CollectionConfiguration()
            
            //get the channels and documentIds to filter for the collections
            //these are optional
            if item.config.channels.count > 0 {
                collectionConfig.channels =  item.config.channels
            }
            if item.config.documentIds.count > 0 {
                collectionConfig.documentIDs = item.config.documentIds
            }
            replicationConfig.addCollections(collections, config: collectionConfig)
        }
    }
    
    private static func replicatorAuthenticatorFromConfig(_ config: [String: Any]?) -> Authenticator? {
        guard let type = config?["type"] as? String,
              let data = config?["data"] as? [String: Any] else {
            return nil
        }
        
        switch type {
            case "session":
                guard let sessionID = data["sessionID"] as? String,
                      let cookieName = data["cookieName"] as? String else {
                    return nil
                }
                return SessionAuthenticator(sessionID: sessionID, cookieName: cookieName)
                
            case "basic":
                guard let username = data["username"] as? String,
                      let password = data["password"] as? String else {
                    return nil
                }
                return BasicAuthenticator(username: username, password: password)
                
            default:
                return nil
        }
    }
    
    public static func generateReplicatorStatusJson(_ status: Replicator.Status) -> [String: Any] {
        var errorJson: [String: Any]?
        if let error = status.error {
            errorJson = [
                "message": error.localizedDescription
            ]
        }
        
        let progressJson: [String: Any] = [
            "completed": status.progress.completed,
            "total": status.progress.total
        ]
        
        if let errorJson = errorJson {
            return [
                "activityLevel": status.activity.rawValue,
                "error": errorJson,
                "progress": progressJson
            ]
        } else {
            return [
                "activityLevel": status.activity.rawValue,
                "progress": progressJson
            ]
        }
    }
    
    public static func generateReplicationJson(_ replication: [ReplicatedDocument], isPush: Bool) -> [String: Any] {
        var docs = [[String: Any]]()
        
        for document in replication {
            var flags = [String]()
            if document.flags.contains(.deleted) {
                flags.append("DELETED")
            }
            if document.flags.contains(.accessRemoved) {
                flags.append("ACCESS_REMOVED")
            }
            var documentDictionary: [String: Any] = ["id": document.id, "flags": flags, "scopeName": document.scope, "collectionName": document.collection]
            
            if let error = document.error {
                documentDictionary["error"] = [
                    "message": error.localizedDescription
                ]
            }
            
            docs.append(documentDictionary)
        }
        
        return [
            "isPush": isPush ? true : false,
            "documents": docs
        ]
    }
    
}
