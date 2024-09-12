import { AbstractIndex, IndexType } from './abstract-index';
import { Expression } from './expression';

/**
 * Index for Full-Text search
 */
export class FullTextIndex extends AbstractIndex {
  private indexItems: FullTextIndexItem[];
  private _language = FullTextIndex.getDefaultLanguage();
  private _ignoreAccents = false;

  constructor(...indexItems: FullTextIndexItem[]) {
    super();
    this.indexItems = indexItems;
  }

  /**
   * The language code which is an ISO-639 language such as "en", "fr", etc.
   * Setting the language code affects how word breaks and word stems are parsed.
   * Without setting the value, the current locale's language will be used. Setting
   * a nil or "" value to disable the language features.
   */
  public setLanguage(language: string): FullTextIndex {
    this._language = language;
    return this;
  }

  /**
   * Set the true value to ignore accents/diacritical marks. The default value is false.
   */
  public setIgnoreAccents(ignoreAccents: boolean): FullTextIndex {
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

  items(): any[] {
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
      items: this.items(),
    };
  }

  private static getDefaultLanguage(): string {
    return 'en';
    //return Locale.getDefault().getLanguage();
  }
}

/**
 * Full-text Index Item.
 */
export class FullTextIndexItem {
  private constructor(public expression: Expression) {
    this.expression = expression;
  }

  /**
   * Creates a full-text search index item with the given property.
   *
   * @param property A property used to perform the match operation against with.
   * @return The full-text search index item.
   */
  public static property(property: string): FullTextIndexItem {
    return new FullTextIndexItem(Expression.property(property));
  }
}
