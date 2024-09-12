"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scope = void 0;
var _engineLocator = require("./engine-locator.cjs");
class Scope {
  _engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);

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
exports.Scope = Scope;
//# sourceMappingURL=scope.cjs.map