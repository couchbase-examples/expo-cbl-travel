package cbl.js.kotlin

data class CollectionDtoWrapper(val collection: CollectionDto)

data class CollectionDto(
    val collectionName: String,
    val scopeName: String,
    val databaseName: String,
    val isError: Boolean)
