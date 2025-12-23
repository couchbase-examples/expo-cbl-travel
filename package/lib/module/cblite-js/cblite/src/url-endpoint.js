"use strict";

export class URLEndpoint {
  // eslint-disable-next-line
  constructor(url) {
    this.url = url;
  }
  toJson() {
    return {
      url: this.url
    };
  }
}
//# sourceMappingURL=url-endpoint.js.map