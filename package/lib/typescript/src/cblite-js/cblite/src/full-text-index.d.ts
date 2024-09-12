import { AbstractIndex, IndexType } from './abstract-index';
import { Expression } from './expression';
/**
 * Index for Full-Text search
 */
export declare class FullTextIndex extends AbstractIndex {
    private indexItems;
    private _language;
    private _ignoreAccents;
    constructor(...indexItems: FullTextIndexItem[]);
    /**
     * The language code which is an ISO-639 language such as "en", "fr", etc.
     * Setting the language code affects how word breaks and word stems are parsed.
     * Without setting the value, the current locale's language will be used. Setting
     * a nil or "" value to disable the language features.
     */
    setLanguage(language: string): FullTextIndex;
    /**
     * Set the true value to ignore accents/diacritical marks. The default value is false.
     */
    setIgnoreAccents(ignoreAccents: boolean): FullTextIndex;
    type(): IndexType;
    language(): string;
    ignoreAccents(): boolean;
    items(): any[];
    toJson(): {
        type: string;
        language: string;
        ignoreAccents: boolean;
        items: any[];
    };
    private static getDefaultLanguage;
}
/**
 * Full-text Index Item.
 */
export declare class FullTextIndexItem {
    expression: Expression;
    private constructor();
    /**
     * Creates a full-text search index item with the given property.
     *
     * @param property A property used to perform the match operation against with.
     * @return The full-text search index item.
     */
    static property(property: string): FullTextIndexItem;
}
//# sourceMappingURL=full-text-index.d.ts.map