package cbl.js.kotlin

import android.util.Log
import com.couchbase.lite.Document
import com.couchbase.lite.DocumentFlag
import com.eclipsesource.v8.V8
import com.eclipsesource.v8.V8Array
import com.eclipsesource.v8.V8Object

object JavaScriptFilterEvaluator {
    private const val TAG = "JSFilterEvaluator"

    // Thread-local V8 instances for thread safety and performance
    private val threadLocalV8 = ThreadLocal<V8Runtime>()

    private data class V8Runtime(
        val v8: V8,
        val compiledFunctions: MutableMap<String, String> = mutableMapOf()
    )

    // Track all V8 objects that need cleanup
    private data class V8Resources(
        val objects: MutableList<V8Object> = mutableListOf(),
        val arrays: MutableList<V8Array> = mutableListOf()
    ) {
        fun release() {
            arrays.forEach { array ->
                try {
                    if (!array.isReleased) array.release()
                } catch (e: Exception) {
                    Log.w(TAG, "Failed to release V8Array: ${e.message}")
                }
            }
            objects.forEach { obj ->
                try {
                    if (!obj.isReleased) obj.release()
                } catch (e: Exception) {
                    Log.w(TAG, "Failed to release V8Object: ${e.message}")
                }
            }
        }
    }

    private fun getV8Runtime(): V8Runtime {
        var runtime = threadLocalV8.get()
        if (runtime == null || runtime.v8.isReleased) {
          if (runtime != null && !runtime.v8.isReleased) {
                try {
                    runtime.v8.release()
                } catch (e: Exception) {
                    Log.w(TAG, "Failed to cleanup old V8 runtime: ${e.message}")
                }
            }

            val v8 = V8.createV8Runtime()

            // Add Android logging bridge
            v8.registerJavaMethod({ _, parameters ->
                val message = parameters?.let { params ->
                    (0 until params.length()).map { i ->
                        params[i]?.toString() ?: "null"
                    }.joinToString(" ")
                } ?: ""
                Log.d("JSFilter", message)
            }, "androidLog")

            // Setup console that uses the bridge
            val consoleScript = """
                var console = {
                    log: function() {
                        var args = Array.prototype.slice.call(arguments);
                        androidLog(args.join(' '));
                    }
                };
            """.trimIndent()
            v8.executeScript(consoleScript)

            runtime = V8Runtime(v8)
            threadLocalV8.set(runtime)
        }
        return runtime
    }

    /**
     * Filter evaluation
     */
    fun evaluateFilter(filterFunction: String, document: Document, flags: Set<DocumentFlag>): Boolean {
        val resources = V8Resources()

        return try {
            val runtime = getV8Runtime()
            val v8 = runtime.v8

            val compiledFunction = getCompiledFunction(runtime, filterFunction)

            // Create V8 objects from document and flags
            val docObj = createDocumentObject(v8, document, resources)
            val flagsArray = createFlagsArray(v8, flags)

            try {
                v8.add("doc", docObj)
                v8.add("flags", flagsArray)

                val script = "($compiledFunction)(doc, flags)"
                val result = v8.executeScript(script)

                when (result) {
                    is Boolean -> result
                    else -> false
                }
            } finally {
                v8.executeScript("delete doc; delete flags;")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Filter evaluation error: ${e.message}")
            false
        } finally {
            resources.release();
        }
    }

    private fun getCompiledFunction(runtime: V8Runtime, filterFunction: String): String {
        return runtime.compiledFunctions.getOrPut(filterFunction) {
            try {
                val wrapped = """
                    function(doc, flags) {
                        try {
                            const ReplicatedDocumentFlag = {
                                DELETED: 'DELETED',
                                ACCESS_REMOVED: 'ACCESS_REMOVED'
                            };
                            var filterFunc = $filterFunction;
                            return !!filterFunc(doc, flags);
                        } catch (e) {
                            console.log('Filter error: ' + e.toString());
                            return false;
                        }
                    }
                """.trimIndent()

                // Validate compilation
                runtime.v8.executeScript("($wrapped)")
                wrapped
            } catch (e: Exception) {
                Log.e(TAG, "Function compilation failed: ${e.message}")
                "function(doc, flags) { return false; }"
            }
        }
    }

    /**
     * Create V8 object from document
     */
     private fun createDocumentObject(v8: V8, document: Document, resources: V8Resources): V8Object {
        val obj = V8Object(v8)
        resources.objects.add(obj)

        try {
            val docMap = document.toMap().toMutableMap()
            docMap["id"] = document.id

            // Add properties directly to V8 object
            for ((key, value) in docMap) {
                addValueToV8Object(obj, key, value, resources)
            }
        } catch (e: Exception) {
            Log.w(TAG, "Document conversion warning: ${e.message}")
            resources.release()

            val fallback = V8Object(v8)
            fallback.add("id", document.id)
            return fallback
        }

        return obj
    }

    /**
     * Add values to V8 object with type checking
     */
    private fun addValueToV8Object(obj: V8Object, key: String, value: Any?, resources: V8Resources) {
        when (value) {
            is String -> obj.add(key, value)
            is Int -> obj.add(key, value)
            is Long -> obj.add(key, value.toDouble()) // Convert Long to Double to match JavaScript Number type (safe up to ±2^53)
            is Double -> obj.add(key, value)
            is Float -> obj.add(key, value.toDouble())
            is Boolean -> obj.add(key, value)
            is Map<*, *> -> {
                val nestedObj = V8Object(obj.runtime)
                resources.objects.add(nestedObj)

                for ((nestedKey, nestedValue) in value) {
                    if (nestedKey is String) {
                        addValueToV8Object(nestedObj, nestedKey, nestedValue, resources)
                    }
                }
                obj.add(key, nestedObj)
            }
            is List<*> -> {
                val v8Array = V8Array(obj.runtime)
                resources.arrays.add(v8Array)

                for (item in value) {
                    when (item) {
                        is String -> v8Array.push(item)
                        is Number -> v8Array.push(item.toDouble())
                        is Boolean -> v8Array.push(item)
                        null -> v8Array.pushNull()
                        is Map<*, *> -> {
                            val itemObj = V8Object(obj.runtime)
                            resources.objects.add(itemObj)
                            for ((itemKey, itemValue) in item) {
                                if (itemKey is String) {
                                    addValueToV8Object(itemObj, itemKey, itemValue, resources)
                                }
                            }
                            v8Array.push(itemObj)
                        }
                        else -> v8Array.push(item.toString())
                    }
                }
                obj.add(key, v8Array)
            }
            null -> obj.addNull(key)
            else -> obj.add(key, value.toString())
        }
    }


    /**
     * Create V8 array from flags
     */
    private fun createFlagsArray(v8: V8, flags: Set<DocumentFlag>): V8Array {
        val array = V8Array(v8)
        
        mapOf(
            DocumentFlag.DELETED to "DELETED",
            DocumentFlag.ACCESS_REMOVED to "ACCESS_REMOVED"
        ).forEach { (flag, name) ->
            if (flags.contains(flag)) {
                array.push(name)
            }
        }
        
        return array
    }

    /**
     * Create replication filter
     */
    fun createFilter(functionString: String?): com.couchbase.lite.ReplicationFilter? {
        if (functionString.isNullOrEmpty()) return null

        return com.couchbase.lite.ReplicationFilter { document, flags ->
            evaluateFilter(functionString, document, flags)
        }
    }

    /**
     * Cleanup method - call when appropriate (e.g., app shutdown)
     */
    fun cleanup() {
        try {
            val runtime = threadLocalV8.get()
            if (runtime != null && !runtime.v8.isReleased) {
                runtime.v8.release()
                threadLocalV8.remove()
            }
        } catch (e: Exception) {
            Log.w(TAG, "Cleanup V8 warning: ${e.message}")
        }
    }
}
