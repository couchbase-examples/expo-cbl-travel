//
//  CBLPrediction+Swift.h
//  CouchbaseLite
//
//  Copyright (c) 2019 Couchbase, Inc. All rights reserved.
//  COUCHBASE CONFIDENTIAL -- part of Couchbase Lite Enterprise Edition
//

#import "CBLPrediction.h"

NS_ASSUME_NONNULL_BEGIN

typedef CBLDictionary* __nullable (^CBLPredictiveModelBlock)(CBLDictionary*);

@interface CBLPrediction ()

- (void) registerModelWithName: (NSString*)name usingBlock: (CBLPredictiveModelBlock)block;

@end

NS_ASSUME_NONNULL_END
