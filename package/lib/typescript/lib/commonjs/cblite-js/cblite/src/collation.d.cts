export const __esModule: boolean;
export class Collation {
    static ascii(): CollationASCII;
    static unicode(): CollationUnicode;
    _unicode: boolean;
    _ignoreCase: boolean;
    _ignoreAccents: boolean;
    _locale: any;
    toString(): string;
    asJSON(): {
        UNICODE: boolean;
        LOCALE: any;
        CASE: boolean;
        DIAC: boolean;
    };
}
export class CollationASCII extends Collation {
    ignoreCase(ignoreCase: any): this;
}
export class CollationUnicode extends Collation {
    ignoreCase(ignoreCase: any): this;
    ignoreAccents(ignoreAccents: any): this;
    locale(locale: any): this;
}
//# sourceMappingURL=collation.d.cts.map