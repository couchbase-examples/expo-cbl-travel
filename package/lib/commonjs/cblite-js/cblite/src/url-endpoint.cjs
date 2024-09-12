"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.URLEndpoint = void 0;
class URLEndpoint {
  constructor(url) {
    this.url = url;
  }
  toJson() {
    return {
      url: this.url
    };
  }
}
exports.URLEndpoint = URLEndpoint;
//# sourceMappingURL=url-endpoint.cjs.map