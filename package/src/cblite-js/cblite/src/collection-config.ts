export class CollectionConfig {
  private channels: string[];
  private documentIds: string[];

  constructor(
    channels: string[] | null | undefined,
    documentIds: string[] | null | undefined
  ) {
    this.channels = channels ?? [];
    this.documentIds = documentIds ?? [];
  }

  setChannels(channels: string[]) {
    this.channels = channels;
  }

  setDocumentIDs(documentIds: string[]) {
    this.documentIds = documentIds;
  }
}
