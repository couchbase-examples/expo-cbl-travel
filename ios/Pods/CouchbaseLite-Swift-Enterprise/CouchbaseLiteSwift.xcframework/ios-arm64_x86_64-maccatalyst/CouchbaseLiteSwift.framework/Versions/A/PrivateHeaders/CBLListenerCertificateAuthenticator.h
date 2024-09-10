//
//  CBLListenerCertificateAuthenticator.h
//  CouchbaseLite
//
//  Copyright (c) 2020 Couchbase, Inc. All rights reserved.
//  COUCHBASE CONFIDENTIAL -- part of Couchbase Lite Enterprise Edition
//

#import <Foundation/Foundation.h>
#import "CBLListenerAuthenticator.h"

NS_ASSUME_NONNULL_BEGIN

/**
ENTERPRISE EDITION ONLY.

Certificate Authenticator Callback Block .
*/
typedef BOOL (^CBLListenerCertificateAuthenticatorBlock) (NSArray* certs);

/**
ENTERPRISE EDITION ONLY.

Certificate Authenticator for the CBLURLEndpointListener.
*/
@interface CBLListenerCertificateAuthenticator : NSObject <CBLListenerAuthenticator>

/** Initialize with the root certificates to trust when verifying client certificates */
- (instancetype) initWithRootCerts: (NSArray*)certs;

/** Initialize with a certificate authenticator block for verifying client certificates */
- (instancetype) initWithBlock: (CBLListenerCertificateAuthenticatorBlock)authBlock;

@end

NS_ASSUME_NONNULL_END
