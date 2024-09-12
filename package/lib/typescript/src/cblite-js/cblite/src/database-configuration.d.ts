/**
 * Configuration for opening a database
 */
export declare class DatabaseConfiguration {
    directory: string;
    encryptionKey: string;
    constructor();
    constructor(arg1: DatabaseConfiguration);
    constructor(arg1: string, arg2: string);
    getDirectory(): string;
    setDirectory(directory: string): this;
    getEncryptionKey(): string;
    setEncryptionKey(key: string): this;
}
//# sourceMappingURL=database-configuration.d.ts.map