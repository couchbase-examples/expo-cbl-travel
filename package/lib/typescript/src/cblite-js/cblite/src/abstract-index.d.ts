export interface Index {
}
export declare enum IndexType {
    Value = 0,
    FullText = 1,
    Geo = 2
}
export declare abstract class AbstractIndex implements Index {
    abstract type(): IndexType;
    abstract language(): string;
    abstract ignoreAccents(): boolean;
    abstract items(): any[];
    abstract toJson(): any;
}
//# sourceMappingURL=abstract-index.d.ts.map