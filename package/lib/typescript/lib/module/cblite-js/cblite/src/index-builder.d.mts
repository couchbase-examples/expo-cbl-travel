export class IndexBuilder {
    /**
     * Create a value index with the given index items. The index items are a list of
     * the properties or expressions to be indexed.
     *
     * @param items The index items
     * @return The value index
     */
    static valueIndex(...items: any[]): ValueIndex;
    /**
     * Create a full-text search index with the given index item and options. Typically the index item is
     * the property that is used to perform the match operation against with.
     *
     * @param items The index items.
     * @return The full-text search index.
     */
    static fullTextIndex(...items: any[]): FullTextIndex;
}
import { ValueIndex } from "./value-index.mjs";
import { FullTextIndex } from "./full-text-index.mjs";
//# sourceMappingURL=index-builder.d.mts.map