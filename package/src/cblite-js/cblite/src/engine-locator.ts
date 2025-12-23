import { ICoreEngine } from '../core-types';

export class EngineLocator {
  private static instance: EngineLocator;

  static readonly key: string = 'default';
  private static engines: Map<string, ICoreEngine> = new Map();
  private constructor() {}

   /**
   * Returns the singleton instance of EngineLocator
   * @returns {EngineLocator} The singleton instance of the EngineLocator
   * @example
   * const locator = EngineLocator.getInstance();
   * // Use the same instance throughout the application
   * const sameLocator = EngineLocator.getInstance(); // Returns the same instance
   */
  static getInstance(): EngineLocator {
    if (!EngineLocator.instance) {
      EngineLocator.instance = new EngineLocator();
    }
    return EngineLocator.instance;
  }

   /**
   * Registers a core engine implementation with the EngineLocator
   * @param {string} key - The unique identifier for the engine
   * @param {ICoreEngine} service - The core engine implementation to register
   * @example
   * const engine = new MyCoreEngine();
   * EngineLocator.registerEngine('myEngine', engine);
   * 
   * // Later, retrieve the engine
   * const sameEngine = EngineLocator.getEngine('myEngine');
   */
  static registerEngine(key: string, service: ICoreEngine): void {
    EngineLocator.engines.set(key, service);
  }

    /**
   * Retrieves a registered core engine implementation by its key
   * @param {string} key - The unique identifier of the engine to retrieve
   * @returns {ICoreEngine} The registered core engine implementation
   * @example
   * // First register an engine
   * const engine = new MyCoreEngine();
   * EngineLocator.registerEngine('myEngine', engine);
   * 
   * // Then retrieve it
   * const retrievedEngine = EngineLocator.getEngine('myEngine');
   * // retrievedEngine === engine
   */
  static getEngine(key: string): ICoreEngine {
    return EngineLocator.engines.get(key);
  }
}
