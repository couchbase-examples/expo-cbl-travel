export declare class Collation {
    protected _unicode: boolean;
    protected _ignoreCase: boolean;
    protected _ignoreAccents: boolean;
    protected _locale: string;
    static ascii(): CollationASCII;
    static unicode(): CollationUnicode;
    toString(): string;
    asJSON(): any;
}
export declare class CollationASCII extends Collation {
    constructor();
    ignoreCase(ignoreCase: boolean): this;
}
export declare class CollationUnicode extends Collation {
    constructor();
    ignoreCase(ignoreCase: boolean): this;
    ignoreAccents(ignoreAccents: boolean): this;
    locale(locale: string): this;
}
//# sourceMappingURL=collation.d.ts.map