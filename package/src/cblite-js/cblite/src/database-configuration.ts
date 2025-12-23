/**
 * Configuration for opening a database
 */
export class DatabaseConfiguration {
  directory: string;
  encryptionKey: string;

  constructor();
 // eslint-disable-next-line
  constructor(arg: DatabaseConfiguration);
  // eslint-disable-next-line
  constructor(directory: string, encryptionKey: string);
  // eslint-disable-next-line
  constructor(arg1?: string | DatabaseConfiguration, arg2?: string) {
    if (typeof arg1 === 'string') {
      this.directory = arg1 as string;
    } else if (arg1 instanceof DatabaseConfiguration) {
      this.directory = arg1.directory;
      this.encryptionKey = arg1.encryptionKey;
    } else {
      //do nothing
      this.directory = undefined;
    }
    if (typeof arg2 === 'string') {
      this.encryptionKey = arg2 as string;
    }
  }

    /**
   * Returns the directory path where the database files are stored
   * @returns {string} The configured database directory path
   * @example
   * const config = new DatabaseConfiguration();
   * config.setDirectory('/path/to/database');
   * const dir = config.getDirectory();
   * // Returns: '/path/to/database'
   */
  getDirectory() {
    return this.directory;
  }

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
  setDirectory(directory: string) {
    this.directory = directory;
    return this;
  }

  /**
   * Returns the encryption key used for database encryption
   * @returns {string} The configured encryption key, or undefined if no encryption is set
   * @example
   * const config = new DatabaseConfiguration();
   * config.setEncryptionKey('mySecretKey');
   * const key = config.getEncryptionKey();
   * // Returns: 'mySecretKey'
   */
  getEncryptionKey() {
    return this.encryptionKey;
  }

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
  setEncryptionKey(key: string) {
    this.encryptionKey = key;
    return this;
  }
}
