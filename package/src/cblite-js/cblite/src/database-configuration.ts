/**
 * Configuration for opening a database
 */
export class DatabaseConfiguration {
  directory: string;
  encryptionKey: string;

  constructor();

  constructor(arg1: DatabaseConfiguration);

  constructor(arg1: string, arg2: string);

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

  getDirectory() {
    return this.directory;
  }

  setDirectory(directory: string) {
    this.directory = directory;
    return this;
  }

  getEncryptionKey() {
    return this.encryptionKey;
  }

  setEncryptionKey(key: string) {
    this.encryptionKey = key;
    return this;
  }
}
