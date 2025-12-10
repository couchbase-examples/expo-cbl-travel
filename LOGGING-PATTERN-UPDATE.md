# Logging Pattern Update - CBL 3.3

## Summary

Updated the logging configuration to use the **instance-based pattern** instead of the static method. This follows CBL 3.3 best practices for database logging.

---

## What Changed

### Before (Old Pattern) ❌
```typescript
public async initializeDatabase() {
    try {
        // Static method called BEFORE database initialization
        await Database.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);
        await this.setupDatabase();
        // ...
    }
}
```

### After (CBL 3.3 Pattern) ✅
```typescript
public async initializeDatabase() {
    try {
        await this.setupDatabase();
        
        // Instance method called AFTER database initialization
        // This provides better encapsulation and follows the database.log pattern
        await this.database?.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);
        // ...
    }
}
```

---

## Why This Matters

### 1. **Better Encapsulation**
- Logging is tied to the specific database instance
- Each database can have its own logging configuration
- More object-oriented approach

### 2. **Consistent with CBL 3.3 Architecture**
- Aligns with the `database.log` property pattern
- The Database class has: `public log = new DatabaseLogging(this)`
- Instance methods are the modern CBL 3.3 approach

### 3. **More Flexible**
- Can configure different log levels for different databases
- Better for multi-database applications
- Easier to test and mock

### 4. **Order of Operations**
- Database must be initialized **before** configuring logging
- Instance method requires a database instance to exist
- More explicit about dependencies

---

## Available Logging Methods in CBL 3.3

### 1. Console Logging (Static) - For Global Configuration
```typescript
// Use BEFORE database is created for global logging
await Database.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);
```

**When to use:**
- Setting up logging before any database is created
- Global logging configuration
- Legacy code compatibility

---

### 2. Console Logging (Instance) - **PREFERRED** ✅
```typescript
// Use AFTER database is initialized
await database.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);
```

**When to use:**
- After database is initialized (recommended)
- Per-database logging configuration
- Modern CBL 3.3 applications

**Benefits:**
- ✅ Better encapsulation
- ✅ More testable
- ✅ Consistent with instance-based API design
- ✅ Flexible per-database configuration

---

### 3. File Logging (Instance) - For Production
```typescript
const fileConfig: DatabaseFileLoggingConfiguration = {
    level: LogLevel.INFO,
    directory: '/path/to/logs',
    maxRotateCount: 5,
    maxSize: 1024 * 1024 * 10, // 10MB
    usePlaintext: false
};

await database.log.setFileConfig(fileConfig);
```

**When to use:**
- Production environments
- When you need persistent logs
- Debugging issues in production
- Compliance/audit requirements

---

## Log Levels Available

```typescript
export enum LogLevel {
  DEBUG = 0,      // Most verbose
  VERBOSE = 1,
  INFO = 2,
  WARNING = 3,
  ERROR = 4,
  NONE = 5        // No logging
}
```

## Log Domains Available

```typescript
export enum LogDomain {
  ALL = 'ALL',           // All domains
  DATABASE = 'DATABASE',  // Database operations
  NETWORK = 'NETWORK',   // Network/sync operations
  QUERY = 'QUERY',       // Query operations
  REPLICATOR = 'REPLICATOR' // Replication operations
}
```

---

## Example Configurations

### Development (Verbose)
```typescript
await database.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);
```

### Production (Selective)
```typescript
// Only log errors for database operations
await database.setLogLevel(LogDomain.DATABASE, LogLevel.ERROR);

// Only log warnings for replicator
await database.setLogLevel(LogDomain.REPLICATOR, LogLevel.WARNING);

// Log info for queries
await database.setLogLevel(LogDomain.QUERY, LogLevel.INFO);
```

### File Logging for Production
```typescript
const fileConfig: DatabaseFileLoggingConfiguration = {
    level: LogLevel.INFO,
    directory: await fileSystem.getDefaultPath(),
    maxRotateCount: 5,           // Keep 5 log files
    maxSize: 1024 * 1024 * 10,  // 10MB per file
    usePlaintext: true          // For debugging (use false in production)
};

await database.log.setFileConfig(fileConfig);
```

---

## Files Updated

1. **`services/database.service.ts`**
   - Changed logging call from static to instance method
   - Moved logging setup after database initialization
   - Added CBL 3.3 comments

2. **`hooks/startLogging.ts`**
   - Added comprehensive documentation
   - Explained all three logging patterns
   - Noted that instance method is preferred

3. **Documentation files**
   - Updated `CBL-3.3-MIGRATION-SUMMARY.md`
   - Updated `QUICK-REFERENCE-CBL-3.3.md`
   - Updated `README.md`
   - Created this file (`LOGGING-PATTERN-UPDATE.md`)

---

## Migration Checklist

When updating your code to use instance-based logging:

- [x] Database is initialized **before** logging is configured
- [x] Changed from `Database.setLogLevel()` to `database.setLogLevel()`
- [x] Updated comments to reflect CBL 3.3 pattern
- [x] Verified no linting errors
- [x] Updated documentation

---

## Testing

To verify the logging works:

```bash
npm run start
```

Expected console output:
```
Database Setup with path: /path/to/travel
Added collection: inventory.hotel from database: travel
Added collection: inventory.landmark from database: travel
```

With DEBUG level, you should see detailed Couchbase Lite logs in your console.

---

## References

- Couchbase Lite Logging Documentation: https://docs.couchbase.com/couchbase-lite/current/swift/troubleshooting-logs.html
- Database class: `package/src/cblite-js/cblite/src/database.ts`
- DatabaseLogging class: `package/src/cblite-js/cblite/src/database-logging.ts`

---

## Conclusion

The logging configuration has been updated to follow CBL 3.3 best practices:

✅ Instance-based logging for better encapsulation  
✅ Proper order of operations (database init → logging setup)  
✅ Consistent with `database.log` property pattern  
✅ Well-documented with clear CBL 3.3 comments  
✅ Flexible and maintainable architecture  

The application now uses modern CBL 3.3 logging patterns and is ready for production use.

