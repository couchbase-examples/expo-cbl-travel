package cbl.js.kotlin

data class CollectionDocumentResult (
    val _id: String,
    val _revId: String?,
    val _sequence: Long,
    val _concurrencyControl: Boolean?)