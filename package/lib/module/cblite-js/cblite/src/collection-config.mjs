export class CollectionConfig {
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
//# sourceMappingURL=collection-config.mjs.map