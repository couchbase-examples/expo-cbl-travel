package cbl.js.kotiln
import android.content.Context
import com.couchbase.lite.*
import com.couchbase.lite.Collection

import org.json.JSONObject
import java.io.File
typealias CBLCollection = com.couchbase.lite.Collection


object DatabaseManager {
    //Private for management state of state
    private val openDatabases: MutableMap<String, Database> = mutableMapOf()

    //change listeners
    private val defaultCollectionName: String = "_default"
    private val defaultScopeName: String = "_default"

    private fun buildDatabaseConfiguration(config: JSONObject?, context: Context)
    : DatabaseConfiguration {
        val databaseConfig = DatabaseConfiguration()
        config?.let { jsonConfig ->
            if (jsonConfig.has("directory")) {
                databaseConfig.directory = jsonConfig.getString("directory")
            }  else {
                val defaultDirectory = context.filesDir.canonicalPath
                databaseConfig.directory = defaultDirectory
            }
            if (jsonConfig.has("encryptionKey")) {
                val encryptionKey = jsonConfig.getString("encryptionKey")
                if (encryptionKey.isNotEmpty()) {
                    databaseConfig.setEncryptionKey(EncryptionKey(encryptionKey))
                }
            }
        }
        return databaseConfig
    }

    fun changeEncryptionKey(databaseName: String, encryptionKey: String?) {
        val db = getDatabase(databaseName) ?: throw Exception("Error: Database not found.")
        if (encryptionKey == null) {
            db.changeEncryptionKey(null)
            return
        }
        val encryptionKeyValue = EncryptionKey(encryptionKey)
        db.changeEncryptionKey(encryptionKeyValue)
    }

    fun closeDatabase(databaseName: String) {
        synchronized(openDatabases) {
            val database = getDatabase(databaseName)
            database?.close()
        }
    }

    fun copy(path: String, newName: String, databaseConfig: JSONObject?, context: Context) {
        val config = buildDatabaseConfiguration(databaseConfig, context)
        val filePath = File(path)
        Database.copy(filePath, newName, config)
    }

    fun createCollection(collectionName: String,
                         scopeName: String,
                         databaseName: String) : CBLCollection? {
        val db = getDatabase(databaseName)
        return db?.createCollection(collectionName, scopeName)
    }

    fun defaultCollection(databaseName: String) : CBLCollection? {
        val db = getDatabase(databaseName)
        return db?.defaultCollection
    }

    fun defaultScope(databaseName: String): Scope? {
        val db = getDatabase(databaseName)
        return db?.defaultScope
    }

    fun delete(databaseName: String) {
        synchronized(openDatabases) {
            val db = getDatabase(databaseName)
            db?.let { database ->
                database.delete()
                openDatabases.remove(databaseName)
            }
        }
    }

   fun deleteWithPath(
     databaseName: String,
     directoryPath: String) {
      Database.delete(databaseName, File(directoryPath))
    }

    fun deleteCollection(collectionName: String,
                         scopeName: String,
                         databaseName: String) {
        val db = getDatabase(databaseName)
        db?.deleteCollection(collectionName, scopeName)
    }

    fun executeQuery(strQuery: String, databaseName: String, parameters: Parameters?): String {
        val db = getDatabase(databaseName)
        db?.let {database ->
            val query = database.createQuery(strQuery)
            if (parameters != null) {
                query.parameters = parameters
            }
            val results = query.execute().allResults()
            val jsonResults = results.map { it.toJSON() }
            val stringResults = jsonResults.joinToString(",")
            val returnResults = "[$stringResults]"
            return returnResults
        }
        return ""
    }

    fun exists(databaseName: String, directoryPath:String): Boolean {
        val directory = File(directoryPath)
        return Database.exists(databaseName, directory)
    }

    fun explainQuery(strQuery: String, databaseName: String, parameters: Parameters?): String {
        val db = getDatabase(databaseName)
        db?.let { database ->
            val query = database.createQuery(strQuery)
            if (parameters != null) {
                query.parameters = parameters
            }
            val results = query.explain()
            return results
        }
        return ""
    }

    fun getCollection(collectionName: String,
                         scopeName: String,
                         databaseName: String) : CBLCollection? {
        val db = getDatabase(databaseName)
        return db?.getCollection(collectionName, scopeName)
    }

    fun getCollections(scopeName: String,
                       databaseName: String): MutableSet<Collection>? {
       val db = getDatabase(databaseName)
       return db?.getCollections(scopeName)
    }

    fun getDatabase(databaseName: String): Database? {
        synchronized(openDatabases){
            if (openDatabases.containsKey(databaseName)) {
                return openDatabases[databaseName]!!
            }
            return null
        }
    }

    fun getPath(databaseName: String) : String {
        val db = getDatabase(databaseName)
        return db?.path ?: ""
    }

    fun getScope(databaseName: String, scopeName: String): Scope? {
        val db = getDatabase(databaseName)
        return db?.getScope(scopeName)
    }

    fun openDatabase(databaseName: String, config: JSONObject?, context: Context): Database {
        synchronized(openDatabases) {
            val databaseConfig = buildDatabaseConfiguration(config, context)
            val newDatabase = Database(databaseName, databaseConfig)
            if (openDatabases.containsKey(databaseName)) {
                openDatabases.remove(databaseName)
            }
            openDatabases[databaseName] = newDatabase
            return newDatabase
        }
    }

    fun performMaintenance(databaseName: String, maintenanceType: MaintenanceType) {
        val db = getDatabase(databaseName)
        db?.performMaintenance(maintenanceType)
    }

    fun scopes (databaseName: String): Set<Scope> {
        val db = getDatabase(databaseName)
        return db?.scopes ?: setOf()
    }
}
