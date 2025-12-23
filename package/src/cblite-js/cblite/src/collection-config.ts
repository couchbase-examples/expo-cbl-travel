import type { CollectionConfiguration } from './collection-configuration';

/**
 * **[DEPRECATED - Use CollectionConfiguration instead]**
 * 
 * Configuration for collection replication (OLD API).
 * This class allows multiple collections to share the same replication configuration.
 * 
 * **Migration Guide:**
 * ```typescript
 * // OLD API (still works):
 * const config = new CollectionConfig();
 * config.setChannels(['public']);
 * replConfig.addCollections([collection1, collection2], config);
 * 
 * // NEW API (recommended):
 * const config1 = new CollectionConfiguration(collection1).setChannels(['public']);
 * const config2 = new CollectionConfiguration(collection2).setChannels(['public']);
 * const replConfig = new ReplicatorConfiguration([config1, config2], endpoint);
 * ```
 * 
 * @deprecated Use {@link CollectionConfiguration} instead for better type safety and clarity.
 */
export class CollectionConfig {
  private channels: string[];
  private documentIDs: string[];
  private pullFilter: string;
  private pushFilter: string;

  constructor() {
    this.channels = [];
    this.documentIDs = [];
    this.pullFilter = "";
    this.pushFilter = "";
  }

  /**
   * Gets the list of Sync Gateway channel names to pull from.
   * 
   * @returns Array of channel names
   * @deprecated Use {@link CollectionConfiguration.getChannels} instead
   */
  getChannels(): string[] {
    return this.channels;
  }

  /**
   * Gets the list of document IDs to replicate.
   * 
   * @returns Array of document IDs
   * @deprecated Use {@link CollectionConfiguration.getDocumentIDs} instead
   */
  getDocumentIDs(): string[] {
    return this.documentIDs;
  }

  /**
   * Gets the pull replication filter function.
   * 
   * @returns The pull filter function as a string
   * @deprecated Use {@link CollectionConfiguration.getPullFilter} instead
   */
  getPullFilter(): string {
    return this.pullFilter;
  }

  /**
   * Gets the push replication filter function.
   * 
   * @returns The push filter function as a string
   * @deprecated Use {@link CollectionConfiguration.getPushFilter} instead
   */
  getPushFilter(): string {
    return this.pushFilter;
  }

  /**
   * Sets the list of Sync Gateway channel names to pull from.
   * 
   * @param channels - Array of channel names
   * @deprecated Use {@link CollectionConfiguration.setChannels} instead
   */
  setChannels(channels: string[]) {
    this.channels = channels;
  }

  /**
   * Sets the list of document IDs to replicate.
   * 
   * @param documentIDs - Array of document IDs
   * @deprecated Use {@link CollectionConfiguration.setDocumentIDs} instead
   */
  setDocumentIDs(documentIDs: string[]) {
    this.documentIDs = documentIDs;
  }

  /**
   * Sets the pull replication filter.
   * 
   * @param pullFilter - Filter function for pull replication
   * @deprecated Use {@link CollectionConfiguration.setPullFilter} instead
   */
  setPullFilter(pullFilter: (document: any, flags: string[]) => boolean) {
    this.pullFilter = pullFilter.toString();
  }

  /**
   * Sets the push replication filter.
   * 
   * @param pushFilter - Filter function for push replication
   * @deprecated Use {@link CollectionConfiguration.setPushFilter} instead
   */
  setPushFilter(pushFilter: (document: any, flags: string[]) => boolean) {
    this.pushFilter = pushFilter.toString();
  }

  /**
   * Converts this config to JSON for the native layer.
   * 
   * @returns JSON object
   * @internal
   */
  toJson(): any {
    return {
      channels: this.channels,
      documentIds: this.documentIDs,
      pullFilter: this.pullFilter,
      pushFilter: this.pushFilter,
    };
  }
}

