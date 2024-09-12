"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileSystem = void 0;
var _engineLocator = require("./engine-locator.cjs");
class FileSystem {
  _engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);
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
exports.FileSystem = FileSystem;
//# sourceMappingURL=file-system.cjs.map