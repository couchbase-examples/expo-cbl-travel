import { ICoreEngine } from '../core-types';

export class EngineLocator {
  private static instance: EngineLocator;

  static readonly key: string = 'default';
  private static engines: Map<string, ICoreEngine> = new Map();
  private constructor() {}

  static getInstance(): EngineLocator {
    if (!EngineLocator.instance) {
      EngineLocator.instance = new EngineLocator();
    }
    return EngineLocator.instance;
  }

  static registerEngine(key: string, service: ICoreEngine): void {
    EngineLocator.engines.set(key, service);
  }

  static getEngine(key: string): ICoreEngine {
    return EngineLocator.engines.get(key);
  }
}
