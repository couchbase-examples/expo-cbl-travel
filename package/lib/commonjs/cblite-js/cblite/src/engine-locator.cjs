"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EngineLocator = void 0;
class EngineLocator {
  static key = 'default';
  static engines = new Map();
  constructor() {}
  static getInstance() {
    if (!EngineLocator.instance) {
      EngineLocator.instance = new EngineLocator();
    }
    return EngineLocator.instance;
  }
  static registerEngine(key, service) {
    EngineLocator.engines.set(key, service);
  }
  static getEngine(key) {
    return EngineLocator.engines.get(key);
  }
}
exports.EngineLocator = EngineLocator;
//# sourceMappingURL=engine-locator.cjs.map