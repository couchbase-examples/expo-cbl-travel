import { Collection } from './collection';
import { Database } from './database';
export declare class Scope {
    private _engine;
    /**
     * Scope's name.
     *
     * This property is immutable and cannot be changed after construction.
     * Attempting to modify it will throw a TypeError at runtime.
     *
     * @property
     */
    readonly name: string;
    /**
     * Scope's Database.
     *
     * This property is immutable and cannot be changed after construction.
     * Attempting to modify it will throw a TypeError at runtime.
     *
     * @property
     */
    readonly database: Database;
    constructor(name: string | undefined, database: Database);
    /**
   * Retrieves all collections within this scope
   * @returns {Promise<Collection[]>} A Promise that resolves to an array of Collection instances
   * @throws {Error} If the database is closed or there's an error accessing collections
   */
    collections(): Promise<Collection[]>;
    /**
   * Retrieves a specific collection within this scope by name
   * @param {string} collectionName - The name of the collection to retrieve
   * @returns {Promise<Collection | null>} A Promise that resolves to the Collection instance, or null if not found
   * @throws {Error} If the database is closed or there's an error accessing the collection
   */
    collection(collectionName: string): Promise<Collection | null>;
}
//# sourceMappingURL=scope.d.ts.map