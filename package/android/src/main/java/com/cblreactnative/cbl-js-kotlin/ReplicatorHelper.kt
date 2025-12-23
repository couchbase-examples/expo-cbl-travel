package cbl.js.kotlin

import com.couchbase.lite.*
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableArray
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.net.URI
import java.net.URISyntaxException
import com.couchbase.lite.Collection as CBLCollection

object ReplicatorHelper {
    private const val TAG = "ReplicatorHelper"

    /**
     * **[DUAL API SUPPORT]** Creates a Replicator configuration from a ReadableMap
     * 
     * Mirrors iOS replicatorConfigFromJson method.
     * Automatically detects NEW API or OLD API format and routes to appropriate handler.
     * 
     * NEW API: { "collection": {...}, "config": {...} }
     * OLD API: { "collections": [{collection: {...}}], "config": {...} }
     */
    @Throws(Exception::class)
    fun replicatorConfigFromJson(config: ReadableMap): ReplicatorConfiguration {
        // STEP 1: Parse and validate required fields (same as iOS)
        val targetConfig = config.getMap("target")
            ?: throw Exception("Target configuration is required")
        val urlString = targetConfig.getString("url")
            ?: throw Exception("Target URL is required")
        
        val replicatorTypeStr = config.getString("replicatorType") ?: "PUSH_AND_PULL"
        val replicatorType = getReplicatorTypeFromString(replicatorTypeStr)
        val continuous = config.getBoolean("continuous")
        
        // STEP 2: Create endpoint (same as iOS)
        val endpoint = URLEndpoint(URI(urlString))
        
        // STEP 3: Detect API format and process collections (similar to iOS)
        val collectionConfigStr = config.getString("collectionConfig")
        if (collectionConfigStr.isNullOrEmpty()) {
            throw Exception("Collection configuration is required")
        }
        
        // Detect API format (same logic as iOS line 248-249)
        val jsonArray = JSONArray(collectionConfigStr)
        if (jsonArray.length() == 0) {
            throw Exception("At least one collection configuration is required")
        }
        
        val firstItem = jsonArray.getJSONObject(0)
        val isNewApi = firstItem.has("collection")   // NEW API has "collection" key
        val isOldApi = firstItem.has("collections")  // OLD API has "collections" key
        
        // Create ReplicatorConfiguration with endpoint
        val replicatorConfig = ReplicatorConfiguration(endpoint)
        
        // Process collections based on detected format
        if (isNewApi) {
            // NEW API: Build collection configs and add individually (like iOS line 252-255)
            val collectionConfigs = buildCollectionConfigurationsFromJson(collectionConfigStr)
            
            // Add each collection individually with its specific config (like iOS)
            for ((collection, colConfig) in collectionConfigs) {
                replicatorConfig.addCollection(collection, colConfig)
            }
        } else if (isOldApi) {
            // OLD API: Use bulk add method (like iOS line 256-259)
            processCollectionConfigOldApi(collectionConfigStr, replicatorConfig)
        } else {
            throw Exception("Unrecognized collection configuration format")
        }
        
        // STEP 4: Set replicator type and continuous (same as iOS line 323-332)
        replicatorConfig.type = replicatorType
        replicatorConfig.isContinuous = continuous
        
        // STEP 5: Set boolean properties (same as iOS line 336-342)
        try {
            replicatorConfig.isAcceptOnlySelfSignedServerCertificate = config.getBoolean("acceptSelfSignedCerts")
        } catch (e: Exception) {
            // acceptSelfSignedCerts not provided or invalid
        }
        
        // Note: acceptParentDomainCookies is not available in Android Couchbase Lite SDK
        // The property exists in iOS but not in Android. This is a known platform difference.
        
        // Note: allowReplicationInBackground is not available in Android Couchbase Lite SDK
        // The property exists in iOS but not in Android. This is a known platform difference.
        
        try {
            if (config.hasKey("autoPurgeEnabled")) {
                replicatorConfig.isAutoPurgeEnabled = config.getBoolean("autoPurgeEnabled")
            }
        } catch (e: Exception) {
            // autoPurgeEnabled not provided or invalid
        }
        
        // STEP 6: Set numeric properties (same as iOS line 346-350)
        try {
            replicatorConfig.heartbeat = config.getDouble("heartbeat").toInt()
            replicatorConfig.maxAttempts = config.getInt("maxAttempts")
            replicatorConfig.maxAttemptWaitTime = config.getDouble("maxAttemptWaitTime").toInt()
        } catch (e: Exception) {
            // Numeric properties not provided or invalid
        }
        
        // STEP 7: Set pinned server certificate (same as iOS line 354-364)
        try {
            if (config.hasKey("pinnedServerCertificate")) {
                val certString = config.getString("pinnedServerCertificate")
                if (!certString.isNullOrEmpty()) {
                    // Android doesn't support pinned certificates the same way as iOS
                    // This would need to be implemented using TrustManager if required
                }
            }
        } catch (e: Exception) {
            // pinnedServerCertificate not provided or invalid
        }
        
        // STEP 8: Set headers (same as iOS line 368-372)
        if (config.hasKey("headers") && config.getType("headers") == ReadableType.Map) {
            val headers = config.getMap("headers")
            val headerMap = HashMap<String, String>()
            headers?.entryIterator?.forEach { entry ->
                if (entry.value is String) {
                    headerMap[entry.key] = entry.value as String
                }
            }
            if (headerMap.isNotEmpty()) {
                replicatorConfig.headers = headerMap
            }
        }
        
        // STEP 9: Set authenticator (same as iOS line 376-385)
        if (config.hasKey("authenticator") && config.getType("authenticator") == ReadableType.Map) {
            val authConfig = config.getMap("authenticator")
            if (authConfig != null) {
                val authenticator = createAuthenticator(authConfig)
                if (authenticator != null) {
                    replicatorConfig.authenticator = authenticator
                }
            }
        }
        
        // STEP 10: Return fully configured ReplicatorConfiguration
        return replicatorConfig
    }
    
    /**
     * **[NEW API]** Builds CollectionConfiguration array from JSON (similar to iOS)
     * 
     * Mirrors iOS buildReplicatorCollectionConfigurationsFromJson method.
     * Creates collection-config pairs where each collection has its own configuration.
     * 
     * @param configJson JSON string containing NEW API format collection configurations
     * @return List of collection-config pairs
     */
    @Throws(Exception::class)
    private fun buildCollectionConfigurationsFromJson(configJson: String): List<Pair<CBLCollection, CollectionConfiguration>> {
        try {
            val collectionConfigArray = JSONArray(configJson)
            val result = mutableListOf<Pair<CBLCollection, CollectionConfiguration>>()
            
            for (i in 0 until collectionConfigArray.length()) {
                val collectionConfigItem = collectionConfigArray.getJSONObject(i)
                
                // NEW API format: { "collection": {...}, "config": {...} }
                if (!collectionConfigItem.has("collection")) {
                    throw Exception("Invalid NEW API format: missing 'collection' key")
                }
                
                val collectionData = collectionConfigItem.getJSONObject("collection")
                
                val dbName = collectionData.getString("databaseName")
                val scopeName = collectionData.getString("scopeName")
                val collectionName = collectionData.getString("name")
                
                // Get native collection
                val collection = DatabaseManager.getCollection(collectionName, scopeName, dbName)
                    ?: throw Exception("Collection not found: $scopeName.$collectionName in database $dbName")
                
                // Create CollectionConfiguration
                val collectionConfig = CollectionConfiguration()
                val configData = collectionConfigItem.optJSONObject("config")
                
                if (configData != null) {
                    // Process channels
                    if (configData.has("channels")) {
                        val channelsArray = configData.getJSONArray("channels")
                        val channels = ArrayList<String>()
                        for (j in 0 until channelsArray.length()) {
                            channels.add(channelsArray.getString(j))
                        }
                        if (channels.isNotEmpty()) {
                            collectionConfig.channels = channels
                        }
                    }
                    
                    // Process documentIds
                    if (configData.has("documentIds")) {
                        val docIdsArray = configData.getJSONArray("documentIds")
                        val documentIds = ArrayList<String>()
                        for (j in 0 until docIdsArray.length()) {
                            documentIds.add(docIdsArray.getString(j))
                        }
                        if (documentIds.isNotEmpty()) {
                            collectionConfig.documentIDs = documentIds
                        }
                    }
                    
                    // Process push filter
                    // Note: optString returns "null" string for JSON null, so we need to check for that
                    if (configData.has("pushFilter") && !configData.isNull("pushFilter")) {
                        val pushFilterStr = configData.optString("pushFilter")
                        if (!pushFilterStr.isNullOrEmpty() && pushFilterStr != "null") {
                            val pushFilter = JavaScriptFilterEvaluator.createFilter(pushFilterStr)
                            if (pushFilter != null) {
                                collectionConfig.pushFilter = pushFilter
                            }
                        }
                    }
                    
                    // Process pull filter
                    // Note: optString returns "null" string for JSON null, so we need to check for that
                    if (configData.has("pullFilter") && !configData.isNull("pullFilter")) {
                        val pullFilterStr = configData.optString("pullFilter")
                        if (!pullFilterStr.isNullOrEmpty() && pullFilterStr != "null") {
                            val pullFilter = JavaScriptFilterEvaluator.createFilter(pullFilterStr)
                            if (pullFilter != null) {
                                collectionConfig.pullFilter = pullFilter
                            }
                        }
                    }
                }
                
                result.add(Pair(collection, collectionConfig))
            }
            
            return result
            
        } catch (e: JSONException) {
            throw Exception("Invalid NEW API collection configuration format: ${e.message}")
        }
    }
    
    /**
     * **[OLD API]** Process collection configuration using OLD API pattern
     * 
     * Kept for backward compatibility with OLD API format where multiple collections
     * can share a single configuration.
     * 
     * @param configJson JSON string containing OLD API format collection configurations
     * @param replicatorConfig ReplicatorConfiguration to add collections to
     */
    @Throws(Exception::class)
    private fun processCollectionConfigOldApi(configJson: String, replicatorConfig: ReplicatorConfiguration) {
        try {
            val collectionConfigArray = JSONArray(configJson)
            
            for (i in 0 until collectionConfigArray.length()) {
                val collectionConfigItem = collectionConfigArray.getJSONObject(i)
                
                // OLD API format: { "collections": [{collection: {...}}], "config": {...} }
                if (!collectionConfigItem.has("collections")) {
                    throw Exception("Invalid OLD API format: missing 'collections' key")
                }
                
                val collectionsArray = collectionConfigItem.getJSONArray("collections")
                
                if (collectionsArray.length() == 0) {
                    throw Exception("No collections found in configuration")
                }
                
                val collections = ArrayList<CBLCollection>()
                
                for (j in 0 until collectionsArray.length()) {
                    val collectionWrapper = collectionsArray.getJSONObject(j)
                    val collectionData = collectionWrapper.getJSONObject("collection")
                    
                    val dbName = collectionData.getString("databaseName")
                    val scopeName = collectionData.getString("scopeName")
                    val collectionName = collectionData.getString("name")
                    
                    val collection = DatabaseManager.getCollection(collectionName, scopeName, dbName)
                        ?: throw Exception("Collection not found: $scopeName.$collectionName in database $dbName")
                    
                    collections.add(collection)
                }
                
                // Process config (channels, documentIds, and push/pull filters)
                val collectionConfig = CollectionConfiguration()
                val configData = collectionConfigItem.optJSONObject("config")
                
                if (configData != null) {
                    // Process channels
                    if (configData.has("channels")) {
                        val channelsArray = configData.getJSONArray("channels")
                        val channels = ArrayList<String>()
                        for (j in 0 until channelsArray.length()) {
                            channels.add(channelsArray.getString(j))
                        }
                        if (channels.isNotEmpty()) {
                            collectionConfig.channels = channels
                        }
                    }
                    
                    // Process documentIds
                    if (configData.has("documentIds")) {
                        val docIdsArray = configData.getJSONArray("documentIds")
                        val documentIds = ArrayList<String>()
                        for (j in 0 until docIdsArray.length()) {
                            documentIds.add(docIdsArray.getString(j))
                        }
                        if (documentIds.isNotEmpty()) {
                            collectionConfig.documentIDs = documentIds
                        }
                    }
                    
                    // Process push and pull filters
                    // Note: optString returns "null" string for JSON null, so we need to check for that
                    if (configData.has("pushFilter") && !configData.isNull("pushFilter")) {
                        val pushFilterStr = configData.optString("pushFilter")
                        if (!pushFilterStr.isNullOrEmpty() && pushFilterStr != "null") {
                            val pushFilter = JavaScriptFilterEvaluator.createFilter(pushFilterStr)
                            if (pushFilter != null) {
                                collectionConfig.pushFilter = pushFilter
                            }
                        }
                    }

                    // Note: optString returns "null" string for JSON null, so we need to check for that
                    if (configData.has("pullFilter") && !configData.isNull("pullFilter")) {
                        val pullFilterStr = configData.optString("pullFilter")
                        if (!pullFilterStr.isNullOrEmpty() && pullFilterStr != "null") {
                            val pullFilter = JavaScriptFilterEvaluator.createFilter(pullFilterStr)
                            if (pullFilter != null) {
                                collectionConfig.pullFilter = pullFilter
                            }
                        }
                    }
                }
                
                // OLD API: Add multiple collections with shared config
                replicatorConfig.addCollections(collections, collectionConfig)
            }
        } catch (e: JSONException) {
            throw Exception("Invalid OLD API collection configuration format: ${e.message}")
        }
    }
    
    /**
     * Get ReplicatorType from string representation
     */
    private fun getReplicatorTypeFromString(typeStr: String): ReplicatorType {
        return when (typeStr) {
            "PUSH" -> ReplicatorType.PUSH
            "PULL" -> ReplicatorType.PULL
            else -> ReplicatorType.PUSH_AND_PULL
        }
    }
    
    /**
     * Creates an authenticator from configuration
     */
    private fun createAuthenticator(authConfig: ReadableMap): Authenticator? {
        val type = authConfig.getString("type") ?: return null
        val data = authConfig.getMap("data") ?: return null
        
        return when (type) {
            "basic" -> {
                val username = data.getString("username") ?: return null
                val password = data.getString("password") ?: return null
                BasicAuthenticator(username, password.toCharArray())
            }
            "session" -> {
                val sessionId = data.getString("sessionID") ?: return null
                val cookieName = data.getString("cookieName") ?: return null
                SessionAuthenticator(sessionId, cookieName)
            }
            else -> null
        }
    }
    
    /**
     * Generates a map representation of replicator status
     */
    fun generateReplicatorStatusMap(status: ReplicatorStatus): WritableMap {
        val resultMap = Arguments.createMap()
        
        // Process activity level
        resultMap.putInt("activityLevel", status.activityLevel.ordinal)
        
        // Process progress
        val progressMap = Arguments.createMap()
        progressMap.putInt("completed", status.progress.completed.toInt())
        progressMap.putInt("total", status.progress.total.toInt())
        resultMap.putMap("progress", progressMap)
        
        // Process error if present
        if (status.error != null) {
            val errorMap = Arguments.createMap()
            errorMap.putString("message", status.error?.message)
            resultMap.putMap("error", errorMap)
        }
        
        return resultMap
    }
    
    /**
     * Generates a map representation of document replication data
     */
    fun generateDocumentReplicationMap(documents: List<ReplicatedDocument>, isPush: Boolean): WritableMap {
        val resultMap = Arguments.createMap()
        val docsArray = Arguments.createArray()
        
        // Add isPush flag
        resultMap.putBoolean("isPush", isPush)
        
        // Process each document
        for (document in documents) {
            val docMap = Arguments.createMap()
            
            docMap.putString("id", document.id)
            docMap.putString("scopeName", document.scope)
            docMap.putString("collectionName", document.collection)
            
            // Process flags
            val flagsArray = Arguments.createArray()
            if (document.flags.contains(DocumentFlag.DELETED)) {
                flagsArray.pushString("DELETED")
            }
            if (document.flags.contains(DocumentFlag.ACCESS_REMOVED)) {
                flagsArray.pushString("ACCESS_REMOVED")
            }
            docMap.putArray("flags", flagsArray)
            
            // Process error if present
            if (document.error != null) {
                val errorMap = Arguments.createMap()
                errorMap.putString("message", document.error?.message)
                docMap.putMap("error", errorMap)
            }
            
            docsArray.pushMap(docMap)
        }
        
        resultMap.putArray("documents", docsArray)
        return resultMap
    }
}
