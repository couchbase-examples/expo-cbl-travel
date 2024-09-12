export class EngineLocator {
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
//# sourceMappingURL=engine-locator.mjs.map