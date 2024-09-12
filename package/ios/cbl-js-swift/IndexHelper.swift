//
//  IndexHelper.swift
//  CbliteSwiftJsLib
//
//  Created by Aaron LaBeau on 07/04/24.
//

import Foundation
import CouchbaseLiteSwift

public struct IndexHelper {

    public static func makeValueIndexItems(_ items: [Any]) -> [ValueIndexItem] {
        var valueItems = [ValueIndexItem]()
        for item in items {
            if let entry = item as? [Any], let strEntry = entry.first as? String {
                let propName = String(strEntry[strEntry.index(after: strEntry.startIndex)...])
                let valueItem = ValueIndexItem.property(propName)
                valueItems.append(valueItem)
            }
        }
        return valueItems
    }

    public static func makeFullTextIndexItems(_ items: [Any]) -> [FullTextIndexItem] {
        var fullTextItems = [FullTextIndexItem]()
        for item in items {
            if let entry = item as? [Any], let strEntry = entry.first as? String {
                let propName = String(strEntry[strEntry.index(after: strEntry.startIndex)...])
                let fullTextItem = FullTextIndexItem.property(propName)
                fullTextItems.append(fullTextItem)
            }
        }
        return fullTextItems
    }
}
