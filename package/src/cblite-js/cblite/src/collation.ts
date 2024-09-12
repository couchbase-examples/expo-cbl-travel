export class Collation {
  protected _unicode = false;
  protected _ignoreCase = false;
  protected _ignoreAccents = false;
  protected _locale: string = null;

  static ascii() {
    return new CollationASCII();
  }

  static unicode() {
    return new CollationUnicode();
  }

  toString() {
    return (
      'Collation{' +
      'unicode=' +
      this._unicode +
      ', ignoreCase=' +
      this._ignoreCase +
      ', ignoreAccents=' +
      this._ignoreAccents +
      ", locale='" +
      this._locale +
      "'" +
      '}'
    );
  }

  asJSON() {
    const json: any = {};
    json.UNICODE = this._unicode;
    json.LOCALE = this._locale == null ? null : this._locale;
    json.CASE = !this._ignoreCase;
    json.DIAC = !this._ignoreAccents;
    return json;
  }
}

export class CollationASCII extends Collation {
  constructor() {
    super();
    this._unicode = false;
  }

  ignoreCase(ignoreCase: boolean) {
    this._ignoreCase = ignoreCase;
    return this;
  }
}

export class CollationUnicode extends Collation {
  constructor() {
    super();
    this._unicode = true;
  }

  ignoreCase(ignoreCase: boolean) {
    this._ignoreCase = ignoreCase;
    return this;
  }

  ignoreAccents(ignoreAccents: boolean) {
    this._ignoreAccents = ignoreAccents;
    return this;
  }

  locale(locale: string) {
    this._locale = locale;
    return this;
  }
}
