"use strict";

import { EngineLocator } from "./engine-locator.js";
export class FileSystem {
  _engine = EngineLocator.getEngine(EngineLocator.key);
  async getDefaultPath() {
    const results = await this._engine.file_GetDefaultPath();
    return results.path;
  }
  async getFilesInDirectory(path) {
    return this._engine.file_GetFileNamesInDirectory({
      path
    });
  }
}
//# sourceMappingURL=file-system.js.map