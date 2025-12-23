export const __esModule: boolean;
export class Scope {
    /**
     * Scope's name.
     *
     * This property is immutable and cannot be changed after construction.
     * Attempting to modify it will throw a TypeError at runtime.
     *
     * @property
     */
    /**
     * Scope's Database.
     *
     * This property is immutable and cannot be changed after construction.
     * Attempting to modify it will throw a TypeError at runtime.
     *
     * @property
     */
    constructor(name: any, database: any);
    _engine: ICoreEngine;
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