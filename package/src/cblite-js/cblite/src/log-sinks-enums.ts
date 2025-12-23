/**
 * Log level enumeration
 * 
 * Represents the severity level of log messages.
 * Lower numbers = more verbose, higher numbers = less verbose
 */
export enum LogLevel {
    /** Debug log messages. Only present in debug builds of CouchbaseLite. */
    DEBUG = 0,
    
    /** Verbose log messages. */
    VERBOSE = 1,
    
    /** Informational log messages. */
    INFO = 2,
    
    /** Warning log messages. */
    WARNING = 3,
    
    /** Error log messages. These indicate immediate errors that need to be addressed. */
    ERROR = 4,
    
    /** Disabling log messages of a given log domain. */
    NONE = 5
  }
  
  /**
   * Log domain enumeration
   * 
   * Represents different functional areas of Couchbase Lite that can be logged.
   */
  export enum LogDomain {
    /** Database domain */
    DATABASE = "DATABASE",
    
    /** Query domain */
    QUERY = "QUERY",
    
    /** Replicator domain */
    REPLICATOR = "REPLICATOR",
    
    /** Network domain */
    NETWORK = "NETWORK",
    
    /** Listener domain */
    LISTENER = "LISTENER",
    
    // /** Peer Discovery domain */
    // PEER_DISCOVERY = "PEER_DISCOVERY",
    
    // /** mDNS specific logs used for DNS-SD peer discovery */
    // MDNS = "MDNS",
    
    // /** Multipeer Replication domain */
    // MULTIPEER = "MULTIPEER",
    
    /** All domains (convenience value) */
    ALL = "ALL"
  }