//
//  CBLURLEndpointListener+Swift.h
//  CouchbaseLite
//
//  Copyright (c) 2020 Couchbase, Inc. All rights reserved.
//  COUCHBASE CONFIDENTIAL -- part of Couchbase Lite Enterprise Edition
//

#import "CBLURLEndpointListener.h"

#ifndef COUCHBASE_ENTERPRISE
#error Couchbase Lite EE Only
#endif

NS_ASSUME_NONNULL_BEGIN

@interface CBLURLEndpointListener()

// For tests
+ (BOOL) deleteAnonymousIdentitiesWithError: (NSError**)error;

@end

NS_ASSUME_NONNULL_END
