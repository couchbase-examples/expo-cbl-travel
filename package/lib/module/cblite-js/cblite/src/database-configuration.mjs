/**
 * Configuration for opening a database
 */
export class DatabaseConfiguration {
  constructor(arg1, arg2) {
    if (typeof arg1 === 'string') {
      this.directory = arg1;
    } else if (arg1 instanceof DatabaseConfiguration) {
      this.directory = arg1.directory;
      this.encryptionKey = arg1.encryptionKey;
    } else {
      //do nothing
      this.directory = undefined;
    }
    if (typeof arg2 === 'string') {
      this.encryptionKey = arg2;
    }
  }
  getDirectory() {
    return this.directory;
  }
  setDirectory(directory) {
    this.directory = directory;
    return this;
  }
  getEncryptionKey() {
    return this.encryptionKey;
  }
  setEncryptionKey(key) {
    this.encryptionKey = key;
    return this;
  }
}
//# sourceMappingURL=database-configuration.mjs.map