//
//  CBLTLSIdentity+Swift.h
//  CouchbaseLite
//
//  Copyright (c) 2020 Couchbase, Inc. All rights reserved.
//  COUCHBASE CONFIDENTIAL -- part of Couchbase Lite Enterprise Edition
//

#import "CBLTLSIdentity.h"

#ifndef COUCHBASE_ENTERPRISE
#error Couchbase Lite EE Only
#endif

NS_ASSUME_NONNULL_BEGIN

@interface CBLTLSIdentity ()

// For tests to clean up the identity in the KeyChain
- (BOOL) deleteFromKeyChainWithError: (NSError**)error;

@end

NS_ASSUME_NONNULL_END
