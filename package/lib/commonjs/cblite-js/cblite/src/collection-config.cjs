"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionConfig = void 0;
class CollectionConfig {
  constructor(channels, documentIds) {
    this.channels = channels ?? [];
    this.documentIds = documentIds ?? [];
  }
  setChannels(channels) {
    this.channels = channels;
  }
  setDocumentIDs(documentIds) {
    this.documentIds = documentIds;
  }
}
exports.CollectionConfig = CollectionConfig;
//# sourceMappingURL=collection-config.cjs.map