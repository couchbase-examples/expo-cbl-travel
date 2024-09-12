import { Database, LogDomain, LogLevel } from "cbl-reactnative";

/**
 * Starts logging for the database.
 *
 * This function sets the log level for all log domains to DEBUG, enabling
 * detailed logging  for the database operations. It uses the
 * `cbl-reactnative` library to configure the logging.
 *
 * @returns {Promise<void>} A promise that resolves when the log level is set.
 * @throws Will throw an error if setting the log level fails.
 */
export async function startLogging(): Promise<void> {
	await Database.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);
}