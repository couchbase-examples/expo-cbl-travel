import { Database, LogDomain, LogLevel } from "cbl-reactnative";

/**
 * Starts logging for the database using the static method.
 *
 * CBL 3.3 Logging Patterns:
 * 
 * 1. Console Logging (Static - Global):
 *    await Database.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);
 *    Use this for global logging configuration before database is created.
 * 
 * 2. Console Logging (Instance - Preferred):
 *    await database.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);
 *    Use this after database is initialized for better encapsulation.
 * 
 * 3. File Logging (Instance):
 *    await database.log.setFileConfig({
 *      level: LogLevel.INFO,
 *      directory: '/path/to/logs',
 *      maxRotateCount: 5,
 *      maxSize: 1024 * 1024 * 10
 *    });
 *
 * NOTE: In this app, logging is configured in DatabaseService.initializeDatabase()
 * using the instance method (preferred CBL 3.3 pattern).
 *
 * @returns {Promise<void>} A promise that resolves when the log level is set.
 * @throws Will throw an error if setting the log level fails.
 */
export async function startLogging(): Promise<void> {
	// Static method - use before database is created
	// For instance-based logging, see database.service.ts
	await Database.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);
}