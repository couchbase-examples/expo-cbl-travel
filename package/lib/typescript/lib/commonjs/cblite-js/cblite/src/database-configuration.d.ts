export const __esModule: boolean;
/**
 * Configuration for opening a database
 */
export class DatabaseConfiguration {
    constructor(arg1: any, arg2: any);
    directory: string;
    encryptionKey: string;
    /**
    * Returns the directory path where the database files are stored
    * @returns {string} The configured database directory path
    * @example
    * const config = new DatabaseConfiguration();
    * config.setDirectory('/path/to/database');
    * const dir = config.getDirectory();
    * // Returns: '/path/to/database'
    */
    getDirectory(): string;
    /**
    * Sets the directory path where the database files will be stored
    * @param {string} directory - The path to the directory where database files should be stored
    * @returns {DatabaseConfiguration} The current DatabaseConfiguration instance for method chaining
    * @example
    * const config = new DatabaseConfiguration();
    * config.setDirectory('/path/to/database');
    * // Or chain with other methods
    * config.setDirectory('/path/to/database').setEncryptionKey('myKey');
    */
    setDirectory(directory: string): DatabaseConfiguration;
    /**
     * Returns the encryption key used for database encryption
     * @returns {string} The configured encryption key, or undefined if no encryption is set
     * @example
     * const config = new DatabaseConfiguration();
     * config.setEncryptionKey('mySecretKey');
     * const key = config.getEncryptionKey();
     * // Returns: 'mySecretKey'
     */
    getEncryptionKey(): string;
    /**
    * Sets the encryption key for the database
    * @param {string} key - The encryption key to use for database encryption
    * @returns {DatabaseConfiguration} The current DatabaseConfiguration instance for method chaining
    * @example
    * const config = new DatabaseConfiguration();
    * config.setEncryptionKey('mySecretKey');
    * // Or chain with other methods
    * config.setDirectory('/path/to/db').setEncryptionKey('mySecretKey');
    */
    setEncryptionKey(key: string): DatabaseConfiguration;
}
//# sourceMappingURL=database-configuration.d.ts.map