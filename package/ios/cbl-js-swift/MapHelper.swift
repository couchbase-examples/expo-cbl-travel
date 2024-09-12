//
//  QueryHelper.swift
//  CbliteSwiftJsLib
//
//  Created by Aaron LaBeau on 07/04/24.

import Foundation
import CouchbaseLiteSwift

public struct MapHelper {

    public static func documentToMap(_ document: Document) ->
    [String: Any] {
        var docMap = [String: Any]()
        let documentAsMap = document.toDictionary()
        for (key, value) in documentAsMap {
            if let blobEntry = value as? Blob {
                docMap[key] = blobEntry.properties
            } else {
                docMap[key] = value
            }
        }
        return docMap
    }

    public static func resultToMap(_ result: Result,
                                   databaseName: String) ->
                                   [String: Any] {
        var docMap = result.toDictionary()
        if let idValue = docMap["_id"] {
            docMap["id"] = idValue
            docMap.removeValue(forKey: "_id")
        }
        if let docValue = docMap["_doc"] {
            docMap[databaseName] = docValue
            docMap.removeValue(forKey: "_doc")
        }
        return self.resultDictionaryToMap(docMap, databaseName: databaseName)
    }

    public static func resultDictionaryToMap(_
                                             dictionary: [String: Any],
                                             databaseName: String) -> [String: Any] {
        var docMap = [String: Any]()
        for (key, value) in dictionary {
            let finalKey = key == "*" ? databaseName : key
            if let blobEntry = value as? Blob {
                docMap[finalKey] = blobEntry.properties
            } else if let nestedDictionary = value as? [String: Any] {
                docMap[finalKey] = resultDictionaryToMap(nestedDictionary, databaseName: databaseName)
            } else {
                docMap[finalKey] = value
            }
        }
        return docMap
    }

    public static func toMap(_ map: [String: Any]) -> [String: Any] {
        var document = [String: Any]()
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
                    document[key] = blob
                    continue
                }
            }

            document[key] = value
        }
        return document
    }
}
