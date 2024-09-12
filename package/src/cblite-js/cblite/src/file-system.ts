import { ICoreEngine } from '../core-types';
import { EngineLocator } from './engine-locator';

export class FileSystem {
  private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);

  async getDefaultPath(): Promise<string> {
    const results = await this._engine.file_GetDefaultPath();
    return results.path;
  }

  async getFilesInDirectory(path: string): Promise<{ files: string[] }> {
    return this._engine.file_GetFileNamesInDirectory({ path });
  }
}
