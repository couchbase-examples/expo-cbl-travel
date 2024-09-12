import { AbstractIndex, IndexType } from "./abstract-index.mjs";
import { Expression } from "./expression.mjs";

/**
 * Index for Full-Text search
 */
export class FullTextIndex extends AbstractIndex {
  _language = FullTextIndex.getDefaultLanguage();
  _ignoreAccents = false;
  constructor(...indexItems) {
    super();
    this.indexItems = indexItems;
  }

  /**
   * The language code which is an ISO-639 language such as "en", "fr", etc.
   * Setting the language code affects how word breaks and word stems are parsed.
   * Without setting the value, the current locale's language will be used. Setting
   * a nil or "" value to disable the language features.
   */
  setLanguage(language) {
    this._language = language;
    return this;
  }

  /**
   * Set the true value to ignore accents/diacritical marks. The default value is false.
   */
  setIgnoreAccents(ignoreAccents) {
    this._ignoreAccents = ignoreAccents;
    return this;
  }
  type() {
    return IndexType.FullText;
  }
  language() {
    return this._language;
  }
  ignoreAccents() {
    return this._ignoreAccents;
  }
  items() {
    const items = [];
    for (let item of this.indexItems) {
      items.push(item.expression.asJSON());
    }
    return items;
  }
  toJson() {
    return {
      type: 'full-text',
      language: this._language,
      ignoreAccents: this._ignoreAccents,
      items: this.items()
    };
  }
  static getDefaultLanguage() {
    return 'en';
    //return Locale.getDefault().getLanguage();
  }
}

/**
 * Full-text Index Item.
 */
export class FullTextIndexItem {
  constructor(expression) {
    this.expression = expression;
    this.expression = expression;
  }

  /**
   * Creates a full-text search index item with the given property.
   *
   * @param property A property used to perform the match operation against with.
   * @return The full-text search index item.
   */
  static property(property) {
    return new FullTextIndexItem(Expression.property(property));
  }
}
//# sourceMappingURL=full-text-index.mjs.map