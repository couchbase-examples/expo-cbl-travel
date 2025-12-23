"use strict";

import { EngineLocator } from "./engine-locator.js";
export class Scope {
  _engine = EngineLocator.getEngine(EngineLocator.key);

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

  constructor(name, database) {
    // Define immutable properties using Object.defineProperty
    // This provides runtime protection in addition to TypeScript's compile-time protection
    const propertyOptions = {
      writable: false,
      // Cannot be changed
      configurable: false,
      // Cannot be deleted or redefined
      enumerable: true // Visible in Object.keys(), JSON.stringify()
    };
    Object.defineProperty(this, 'name', {
      value: name ?? '',
      ...propertyOptions
    });
    Object.defineProperty(this, 'database', {
      value: database,
      ...propertyOptions
    });
  }

  /**
  * Retrieves all collections within this scope
  * @returns {Promise<Collection[]>} A Promise that resolves to an array of Collection instances
  * @throws {Error} If the database is closed or there's an error accessing collections
  */
  async collections() {
    const results = await this._engine.collection_GetCollections({
      name: this.database.getUniqueName(),
      scopeName: this.name
    });
    return results.collections;
  }

  /**
  * Retrieves a specific collection within this scope by name
  * @param {string} collectionName - The name of the collection to retrieve
  * @returns {Promise<Collection | null>} A Promise that resolves to the Collection instance, or null if not found
  * @throws {Error} If the database is closed or there's an error accessing the collection
  */
  async collection(collectionName) {
    return this._engine.collection_GetCollection({
      name: this.database.getUniqueName(),
      collectionName: collectionName,
      scopeName: this.name
    });
  }
}
//# sourceMappingURL=scope.js.map