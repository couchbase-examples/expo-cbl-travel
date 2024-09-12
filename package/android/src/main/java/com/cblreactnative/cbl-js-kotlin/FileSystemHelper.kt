package cbl.js.kotiln

import android.content.Context
import java.io.File

object FileSystemHelper {

    fun fileGetDefaultPath(context: Context): String {
        return context.filesDir.canonicalPath
    }

    fun listFilesAndDirectories(path: String): List<String> {
        val directory = File(path)
        val files = directory.listFiles()
        return files?.map { it.name } ?: emptyList()
    }

}