# Quick Reference: CBL 3.3 Changes in This App

## 🔥 Critical Changes

### 1. CollectionConfig Required for Replicator
### 2. Instance-Based Logging Preferred

---

## 🚀 Change #1: CollectionConfig Required

### Before (OLD - Won't Work)
```typescript
const config = new ReplicatorConfiguration(targetUrl);
config.addCollections(collections);  // ❌ Missing second parameter
```

### After (NEW - CBL 3.3)
```typescript
const collectionConfig = new CollectionConfig(undefined, undefined);
const config = new ReplicatorConfiguration(targetUrl);
config.addCollections(collections, collectionConfig);  // ✅ Correct
```

---

## 🚀 Change #2: Instance-Based Logging

### Before (Old - Static Method)
```typescript
await Database.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);  // ⚠️ Works but not preferred
```

### After (NEW - Instance Method)
```typescript
await this.database?.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);  // ✅ Preferred
```

**Why?**
- Better encapsulation
- Consistent with `database.log` property pattern
- Per-database logging configuration
- Modern CBL 3.3 instance-based approach

---

## 📦 New Imports Required

```typescript
import { CollectionConfig } from 'cbl-reactnative';
```

---

## 🎯 CollectionConfig Options

### Sync Everything (Default)
```typescript
const config = new CollectionConfig(undefined, undefined);
```

### Filter by Channels
```typescript
const config = new CollectionConfig(['channel1', 'channel2'], undefined);
```

### Filter by Document IDs
```typescript
const config = new CollectionConfig(undefined, ['doc1', 'doc2']);
```

---

## 🔍 New Collection Properties

### Get Full Collection Name
```typescript
const fullName = collection.fullName();  // Returns "scope.collection"
// Example: "inventory.hotel"
```

### Access Parent Database
```typescript
const dbName = collection.database.getName();
// Example: "travel"
```

---

## 📝 Where Changes Were Made

### `services/database.service.ts`
- ✅ Added `CollectionConfig` import
- ✅ Created `CollectionConfig` instance in `setupReplicator()`
- ✅ Passed config to `addCollections()`
- ✅ Changed to instance-based logging (`database.setLogLevel()`)
- ✅ Moved logging setup after database initialization
- ✅ Added logging with `fullName()` in `getCollections()`
- ✅ Added CBL 3.3 documentation

### `hooks/startLogging.ts`
- ✅ Added CBL 3.3 documentation for logging

### `README.md`
- ✅ Added CBL 3.3 version section

---

## ✅ What Was NOT Changed (Intentionally)

- **No Listeners**: App doesn't use change listeners, so no token changes needed ✓
- **Query Syntax**: Remains the same ✓
- **Database Operations**: All other operations unchanged ✓
- **Static Logging Still Works**: The static method still works, we just prefer instance method ✓

---

## 🧪 Quick Test

Run the app and verify:
```bash
npm run start
```

Check console logs for:
- `Added collection: inventory.hotel from database: travel`
- `Added collection: inventory.landmark from database: travel`
- No errors during replicator setup
- Data syncs successfully

---

## 🐛 Troubleshooting

### Error: "All collections must be from the same database and scope"
- Ensure all collections are from the same database
- In this app: both `hotel` and `landmark` are in `inventory` scope ✓

### Error: Missing CollectionConfig parameter
- Make sure you're passing `CollectionConfig` as second parameter to `addCollections()`
- Check import statement includes `CollectionConfig`

### Replication not working
- Verify Capella connection URL is correct
- Check authentication credentials
- Ensure collections are linked in App Services

---

## 📚 More Information

See `CBL-3.3-MIGRATION-SUMMARY.md` for complete details.

