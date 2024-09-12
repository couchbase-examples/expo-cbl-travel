//
//  FileSystemHelper.swift
//  CbliteSwiftJsLib
//
//  Created by Aaron LaBeau on 07/04/24.
//

import Foundation

public struct FileSystemHelper {

    public static func fileGetDefaultPath() -> String {
        let paths = NSSearchPathForDirectoriesInDomains(.applicationSupportDirectory, .userDomainMask, true)
        return paths.first ?? ""
    }

    public static func fileGetFileNamesInDirectory(_ directoryPath: String) throws -> [String] {
        let fileManager = FileManager.default
        let files = try fileManager.contentsOfDirectory(atPath: directoryPath)
        return files
    }
}
