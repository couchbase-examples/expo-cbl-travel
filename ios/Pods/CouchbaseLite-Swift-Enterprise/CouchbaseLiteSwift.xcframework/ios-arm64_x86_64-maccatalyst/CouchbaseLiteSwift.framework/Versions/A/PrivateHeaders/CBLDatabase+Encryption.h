//
//  CBLDatabase+Encryption.h
//  CouchbaseLite
//
//  Copyright (c) 2018 Couchbase, Inc. All rights reserved.
//  COUCHBASE CONFIDENTIAL -- part of Couchbase Lite Enterprise Edition

#import <Foundation/Foundation.h>
#import "CBLDatabase.h"
@class CBLEncryptionKey;

NS_ASSUME_NONNULL_BEGIN

@interface CBLDatabase (Encryption)

/**
 ENTERPRISE EDITION ONLY.
 
 Changes the database's encryption key, or removes encryption if the new key is nil.
 
 @param key  The encryption key.
 @param error On return, the error if any.
 @return True if the database was successfully re-keyed, or false on failure.
 */
- (BOOL) changeEncryptionKey: (nullable CBLEncryptionKey*)key error: (NSError**)error;

@end

NS_ASSUME_NONNULL_END
