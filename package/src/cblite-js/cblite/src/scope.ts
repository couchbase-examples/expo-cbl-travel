import { ICoreEngine } from '../core-types';
import { EngineLocator } from './engine-locator';
import { Collection } from './collection';
import { Database } from './database';

export class Scope {
  private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);

  /**
   * Scope's name.
   *
   * @property
   */
  name: string;

  /**
   * Scope's Database.
   *
   * @property
   */
  database: Database;

  constructor(name: string | undefined, database: Database) {
    this.name = name ?? '';
    this.database = database;
  }

  async collections(): Promise<Collection[]> {
    const results = await this._engine.collection_GetCollections({
      name: this.database.getName(),
      scopeName: this.name,
    });
    return results.collections;
  }

  async collection(collectionName: string): Promise<Collection | null> {
    return this._engine.collection_GetCollection({
      name: this.database.getName(),
      collectionName: collectionName,
      scopeName: this.name,
    });
  }
}
