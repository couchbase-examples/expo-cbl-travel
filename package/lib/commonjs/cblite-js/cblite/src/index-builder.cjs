"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexBuilder = void 0;
var _valueIndex = require("./value-index.cjs");
var _fullTextIndex = require("./full-text-index.cjs");
class IndexBuilder {
  /**
   * Create a value index with the given index items. The index items are a list of
   * the properties or expressions to be indexed.
   *
   * @param items The index items
   * @return The value index
   */
  static valueIndex(...items) {
    return new _valueIndex.ValueIndex(...items);
  }

  /**
   * Create a full-text search index with the given index item and options. Typically the index item is
   * the property that is used to perform the match operation against with.
   *
   * @param items The index items.
   * @return The full-text search index.
   */
  static fullTextIndex(...items) {
    return new _fullTextIndex.FullTextIndex(...items);
  }
}
exports.IndexBuilder = IndexBuilder;
//# sourceMappingURL=index-builder.cjs.map