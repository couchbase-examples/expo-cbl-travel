import { ICoreEngine } from '../core-types';
export declare class EngineLocator {
    private static instance;
    static readonly key: string;
    private static engines;
    private constructor();
    static getInstance(): EngineLocator;
    static registerEngine(key: string, service: ICoreEngine): void;
    static getEngine(key: string): ICoreEngine;
}
//# sourceMappingURL=engine-locator.d.ts.map