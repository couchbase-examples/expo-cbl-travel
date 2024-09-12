package cbl.js.kotiln

import com.couchbase.lite.Replicator
import com.couchbase.lite.ReplicatorConfiguration
import com.couchbase.lite.ReplicatorStatus
import java.util.UUID

object ReplicatorManager {
    private val replicators: MutableMap<String, Replicator> = mutableMapOf()

    fun cleanUp(replicatorId: String) {
        val replicator = replicators[replicatorId]
        if (replicator != null) {
            replicator.stop()
            replicators.remove(replicatorId)
        } else {
            throw Exception("Replicator not found")
        }
    }

    fun createReplicator(replicatorConfig: ReplicatorConfiguration): String {
        val replicator = Replicator(replicatorConfig)
        val id = UUID.randomUUID().toString()
        replicators[id] = replicator
        return id
    }

    fun getReplicator(replicatorId: String): Replicator? {
        return replicators[replicatorId]
    }

    fun getStatus(replicatorId: String): ReplicatorStatus {
        val replicator = replicators[replicatorId]
        if (replicator != null) {
            return replicator.status
        } else {
            throw Exception("Replicator not found")
        }
    }

    fun isDocumentPending(
        docId: String,
        replicatorId: String,
        collectionName: String,
        scopeName: String,
        databaseName: String
    ): Boolean {
        val replicator = replicators[replicatorId]
        val collection = DatabaseManager.getCollection(collectionName, scopeName, databaseName)
        if (replicator != null && collection != null) {
            return replicator.isDocumentPending(docId, collection)
        } else {
            throw Exception("Replicator or Collection not found")
        }
    }

    fun pendingDocIs(
        replicatorId: String,
        collectionName: String,
        scopeName: String,
        databaseName: String
    ): Set<String> {
        val mutableSet = mutableSetOf<String>()
        val collection = DatabaseManager.getCollection(collectionName, scopeName, databaseName)
        if (collection != null) {
            val replicator = replicators[replicatorId]
            if (replicator != null) {
                val pendingDocIds = replicator.getPendingDocumentIds(collection)
                mutableSet.addAll(pendingDocIds)
            } else {
                throw Exception("Replicator not found")
            }
        } else {
            throw Exception("Collection not found")
        }
        return mutableSet
    }

    fun resetCheckpoint(replicatorId: String) {
        val replicator = replicators[replicatorId]
        if (replicator != null) {
            replicator.stop()
            replicator.start(true)
        } else {
            throw Exception("Replicator not found")
        }
    }

    fun start(replicatorId: String) {
        val replicator = replicators[replicatorId]
        if (replicator != null) {
            replicator.start()
        } else {
            throw Exception("Replicator not found")
        }
    }

    fun stop(replicatorId: String) {
        val replicator = replicators[replicatorId]
        if (replicator != null) {
            replicator.stop()
        } else {
            throw Exception("Replicator not found")
        }
    }
}
