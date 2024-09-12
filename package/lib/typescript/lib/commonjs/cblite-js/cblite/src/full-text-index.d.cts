export const __esModule: boolean;
/**
 * Index for Full-Text search
 */
export class FullTextIndex extends _abstractIndex.AbstractIndex {
    static getDefaultLanguage(): string;
    constructor(...indexItems: any[]);
    _language: string;
    _ignoreAccents: boolean;
    indexItems: any[];
    /**
     * The language code which is an ISO-639 language such as "en", "fr", etc.
     * Setting the language code affects how word breaks and word stems are parsed.
     * Without setting the value, the current locale's language will be used. Setting
     * a nil or "" value to disable the language features.
     */
    setLanguage(language: any): this;
    /**
     * Set the true value to ignore accents/diacritical marks. The default value is false.
     */
    setIgnoreAccents(ignoreAccents: any): this;
    type(): any;
    language(): string;
    ignoreAccents(): boolean;
    items(): any[];
    toJson(): {
        type: string;
        language: string;
        ignoreAccents: boolean;
        items: any[];
    };
}
export class FullTextIndexItem {
    /**
     * Creates a full-text search index item with the given property.
     *
     * @param property A property used to perform the match operation against with.
     * @return The full-text search index item.
     */
    static property(property: any): FullTextIndexItem;
    constructor(expression: any);
    expression: any;
}
import _abstractIndex = require("./abstract-index.cjs");
//# sourceMappingURL=full-text-index.d.cts.map