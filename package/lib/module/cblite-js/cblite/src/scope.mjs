import { EngineLocator } from "./engine-locator.mjs";
export class Scope {
  _engine = EngineLocator.getEngine(EngineLocator.key);

  /**
   * Scope's name.
   *
   * @property
   */

  /**
   * Scope's Database.
   *
   * @property
   */

  constructor(name, database) {
    this.name = name ?? '';
    this.database = database;
  }
  async collections() {
    const results = await this._engine.collection_GetCollections({
      name: this.database.getName(),
      scopeName: this.name
    });
    return results.collections;
  }
  async collection(collectionName) {
    return this._engine.collection_GetCollection({
      name: this.database.getName(),
      collectionName: collectionName,
      scopeName: this.name
    });
  }
}
//# sourceMappingURL=scope.mjs.map