export class EngineLocator {
    static key: string;
    static engines: Map<any, any>;
    static getInstance(): any;
    static registerEngine(key: any, service: any): void;
    static getEngine(key: any): any;
}
//# sourceMappingURL=engine-locator.d.mts.map