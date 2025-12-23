import { Collection } from './collection';
import { ReplicatedDocumentFlag } from './replicated-document';

/**
 * Type definition for replication filter functions.
 * 
 * @param document - The document being replicated
 * @param flags - Array of flags indicating document state (DELETED, ACCESS_REMOVED)
 * @returns true to replicate the document, false to skip it
 */
export type ReplicationFilter = (
  document: Document,
  flags: ReplicatedDocumentFlag[]
) => boolean;

/**
 * CollectionConfiguration represents the replication configuration for a single collection.
 * 
 * This class pairs a Collection object with its specific replication settings such as
 * channels, document IDs, and push/pull filters. Each collection in a replicator can
 * have its own unique configuration.
 * 
 * **NEW API Pattern (Phase 2):**
 * - Each CollectionConfiguration is linked to exactly one Collection
 * - Allows different collections to have different replication settings
 * - Follows the iOS native SDK pattern
 * 
 * @example
 * ```typescript
 * // Create configuration for users collection
 * const usersConfig = new CollectionConfiguration(usersCollection)
 *   .setChannels(['public', 'users'])
 *   .setDocumentIDs([]);
 * 
 * // Create configuration for orders collection with different settings
 * const ordersConfig = new CollectionConfiguration(ordersCollection)
 *   .setChannels(['orders', 'admin'])
 *   .setDocumentIDs(['order-1', 'order-2'])
 *   .setPushFilter((doc, flags) => doc['status'] === 'confirmed');
 * 
 * // Use in ReplicatorConfiguration
 * const replConfig = new ReplicatorConfiguration(
 *   [usersConfig, ordersConfig],
 *   new URLEndpoint('ws://localhost:4984/mydb')
 * );
 * ```
 */
export class CollectionConfiguration {
  private readonly _collection: Collection;
  private _channels: string[] = [];
  private _documentIds: string[] = [];
  private _pushFilter?: string;
  private _pullFilter?: string;

  /**
   * Creates a new CollectionConfiguration for the specified collection.
   * 
   * @param collection - The collection to configure for replication
   * 
   * @example
   * ```typescript
   * const database = await Database.open('mydb');
   * const collection = await database.getCollection('users', '_default');
   * const config = new CollectionConfiguration(collection);
   * ```
   */
  constructor(collection: Collection) {
    if (!collection) {
      throw new Error('Collection cannot be null or undefined');
    }
    this._collection = collection;
  }

  /**
   * Gets the collection associated with this configuration.
   * 
   * @returns The collection object
   * 
   * @example
   * ```typescript
   * const config = new CollectionConfiguration(usersCollection);
   * const col = config.getCollection();
   * console.log(col.name); // "users"
   * ```
   */
  getCollection(): Collection {
    return this._collection;
  }

  /**
   * Gets the channels configured for pull replication.
   * 
   * @returns Array of channel names
   */
  getChannels(): string[] {
    return this._channels;
  }

  /**
   * Sets the Sync Gateway channels to pull from for this collection.
   * 
   * This is used for pull replication only. If not set or empty, all accessible
   * channels will be pulled. Channels that are not accessible to the user will
   * be ignored by Sync Gateway.
   * 
   * @param channels - Array of channel names to filter by
   * @returns This CollectionConfiguration instance for method chaining
   * 
   * @example
   * ```typescript
   * const config = new CollectionConfiguration(collection)
   *   .setChannels(['public', 'users', 'premium']);
   * ```
   */
  setChannels(channels: string[]): CollectionConfiguration {
    this._channels = channels ?? [];
    return this;
  }

  /**
   * Gets the document IDs configured for replication.
   * 
   * @returns Array of document IDs
   */
  getDocumentIDs(): string[] {
    return this._documentIds;
  }

  /**
   * Sets the document IDs to filter for replication.
   * 
   * If specified, only documents with these IDs will be pushed and/or pulled.
   * If not set or empty, all documents in the collection will be replicated
   * (subject to other filters).
   * 
   * @param documentIds - Array of document IDs to replicate
   * @returns This CollectionConfiguration instance for method chaining
   * 
   * @example
   * ```typescript
   * const config = new CollectionConfiguration(collection)
   *   .setDocumentIDs(['user::123', 'user::456', 'user::789']);
   * ```
   */
  setDocumentIDs(documentIds: string[]): CollectionConfiguration {
    this._documentIds = documentIds ?? [];
    return this;
  }

  /**
   * Gets the push filter function string.
   * 
   * @returns The filter function as a string, or undefined if not set
   */
  getPushFilter(): string | undefined {
    return this._pushFilter;
  }

  /**
   * Sets a filter function for push replication.
   * 
   * Only documents for which the function returns true will be pushed to the server.
   * The filter function is converted to a string and evaluated on the native side
   * using JavaScriptCore (iOS) or Rhino (Android).
   * 
   * **Important:** Inside the filter body, document and flag object methods cannot be used.
   * Access properties directly (e.g., `doc['type']` instead of `doc.getString('type')`).
   * 
   * @param filter - Function that returns true to push the document
   * @returns This CollectionConfiguration instance for method chaining
   * 
   * @example
   * ```typescript
   * const config = new CollectionConfiguration(collection)
   *   .setPushFilter((doc, flags) => {
   *     // Only push non-deleted documents of type 'user'
   *     return doc['type'] === 'user' && 
   *            !flags.includes(ReplicatedDocumentFlag.DELETED);
   *   });
   * ```
   */
  setPushFilter(filter: ReplicationFilter): CollectionConfiguration {
    this._pushFilter = filter.toString();
    return this;
  }

  /**
   * Gets the pull filter function string.
   * 
   * @returns The filter function as a string, or undefined if not set
   */
  getPullFilter(): string | undefined {
    return this._pullFilter;
  }

  /**
   * Sets a filter function for pull replication.
   * 
   * Only documents for which the function returns true will be pulled from the server.
   * The filter function is converted to a string and evaluated on the native side
   * using JavaScriptCore (iOS) or Rhino (Android).
   * 
   * **Important:** Inside the filter body, document and flag object methods cannot be used.
   * Access properties directly (e.g., `doc['type']` instead of `doc.getString('type')`).
   * 
   * @param filter - Function that returns true to pull the document
   * @returns This CollectionConfiguration instance for method chaining
   * 
   * @example
   * ```typescript
   * const config = new CollectionConfiguration(collection)
   *   .setPullFilter((doc, flags) => {
   *     // Only pull active documents
   *     return doc['status'] === 'active' && 
   *            !flags.includes(ReplicatedDocumentFlag.DELETED);
   *   });
   * ```
   */
  setPullFilter(filter: ReplicationFilter): CollectionConfiguration {
    this._pullFilter = filter.toString();
    return this;
  }

  /**
   * Creates an array of CollectionConfiguration objects from an array of collections.
   * 
   * This is a convenience method for creating configurations with default settings
   * for multiple collections at once.
   * 
   * @param collections - Array of Collection objects to create configurations for
   * @returns Array of CollectionConfiguration objects with default settings
   * 
   * @example
   * ```typescript
   * const database = await Database.open('mydb');
   * const users = await database.getCollection('users', '_default');
   * const orders = await database.getCollection('orders', '_default');
   * const products = await database.getCollection('products', '_default');
   * 
   * // Create configs with default settings
   * const configs = CollectionConfiguration.fromCollections([users, orders, products]);
   * 
   * // Then customize individual configs as needed
   * configs[0].setChannels(['public']); // users
   * configs[1].setChannels(['orders']); // orders
   * configs[2].setChannels(['products']); // products
   * ```
   */
  static fromCollections(collections: Collection[]): CollectionConfiguration[] {
    return collections.map(col => new CollectionConfiguration(col));
  }

  /**
   * Converts this CollectionConfiguration to a JSON-serializable object.
   * 
   * This is used internally when sending the configuration to the native layer.
   * 
   * @returns Object suitable for JSON serialization
   * 
   * @internal
   */
  toJson(): any {
    return {
      collection: this._collection.toJson(),
      config: {
        channels: this._channels,
        documentIds: this._documentIds,
        pushFilter: this._pushFilter ?? null,
        pullFilter: this._pullFilter ?? null,
      },
    };
  }
}

