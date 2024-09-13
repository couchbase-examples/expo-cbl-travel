import {
    BasicAuthenticator,
    CblReactNativeEngine,
    Collection,
    Database,
    DatabaseConfiguration,
    FileSystem,
    FullTextIndexItem,
    IndexBuilder,
    LogDomain,
    LogLevel,
    Replicator,
    ReplicatorConfiguration,
    URLEndpoint,
    ValueIndexItem,
} from 'cbl-reactnative';

/**
 * Service class for managing the database and its replication.
 */
export class DatabaseService {
    private database: Database | undefined;
    private replicator: Replicator | undefined;
    private engine: CblReactNativeEngine | undefined;

    constructor() {
        //must create a new engine to use the SDK in a React Native environment
        //this must only be done once for the entire app.  This will be implemented as singleton, so it's Ok here.
        this.engine = new CblReactNativeEngine();
    }

    /**
     * returns type of activities in the inventory.location collection
     */
    public async getActivities() {
        const queryStr = "SELECT DISTINCT activity FROM inventory.landmark as activity WHERE landmark.activity IS NOT MISSING";
        return this.database?.createQuery(queryStr).execute();
    }

    /**
     * Retrieves the collections from the database.
     *
     * This function fetches the `hotel` and `landmark` collections from the
     *`inventory` scope of the database. If the collections are found, they
     * are added to an array and returned.
     *
     * @returns {Promise<Collection[]>} A promise that resolves to an array of `Collection` objects.
     * @throws Will throw an error if the database is not initialized.
     */
    private async getCollections(): Promise<Collection[]> {
        const collections: Collection[] = [];
        const hotelCollection = await this.database?.collection('hotel', 'inventory');
        const landmarkCollection = await this.database?.collection('landmark', 'inventory');
        if (hotelCollection !== undefined) {
            collections.push(hotelCollection);
        }
        if (landmarkCollection !== undefined) {
            collections.push(landmarkCollection);
        }
        return collections;
    }

    /**
     * returns an array of ResultSet objects for the hotels that match the Full Text Search term in the inventory.hotel collection
     * @param searchTerm
     */
    public async getHotelsBySearchTerm(searchTerm: string) {
        const queryStr = `SELECT * FROM inventory.hotel as hotel WHERE MATCH(idxTextSearch, '${searchTerm}')`;
        return this.database?.createQuery(queryStr).execute();
    }

    /**
     * returns all hotels in the inventory.hotel collection
     */
    public async getHotels() {
        try {
            const queryStr = "SELECT * FROM inventory.hotel as hotel";
            return this.database?.createQuery(queryStr).execute();
        } catch (error) {
            console.debug(`Error: ${error}`);
            throw error;
        }
    }

    /**
     * returns an array of ResultSet objects for the locations that match the search terms of searchName, searchLocation, and activityType in the inventory.location collection
     * @param searchName - string value to search in the name or title fields
     * @param searchLocation - string value to search in the address, city, state, or country fields
     * @param activityType - string value to filter for in the activity field
     */
    public async getLandmarkBySearchTerm(
        searchName: string,
        searchLocation: string,
        activityType: string) {

        /*
        for the first set we will allow for a search on the name, title, and content fields with the value being upper case or lower case by converting the search term to lower case and then searching for it in the lower case version of the fields
         */
        const nameLower = searchName.toLowerCase();
        let queryStr = `SELECT * FROM inventory.landmark as landmark WHERE `;
        let conditions: string[] = [];
        if (nameLower !== '') {
            conditions.push(`(LOWER(landmark.name) LIKE '%${nameLower}%' OR LOWER(landmark.title) LIKE '%${nameLower}%' OR LOWER(landmark.content) LIKE '%${nameLower}%')`);
        }

       /*
       for locations - the term must be the exact value and is case-sensitive to how it's stored in the database
        */
        if (searchLocation !== '') {
            conditions.push(`(landmark.address LIKE '%${searchLocation}%' OR landmark.city LIKE '%${searchLocation}%' OR landmark.state LIKE '%${searchLocation}%' OR landmark.country LIKE '%${searchLocation}%')`);
        }

        //we always filter by activity
        conditions.push(`landmark.activity = '${activityType}' ORDER BY landmark.name`);

        if (conditions.length > 1) {
            queryStr += conditions.join(' AND ');
        } else {
            queryStr += conditions.join();
        }
        return this.database?.createQuery(queryStr).execute();
    }

    /**
     * Initializes the database by setting up logging and configuring the database.
     * @public
     * @throws Will throw an error if the database initialization fails.
     */
    public async initializeDatabase() {
        try {
            //turned on database logging too verbose to see information in IDE
            await Database.setLogLevel(LogDomain.ALL, LogLevel.DEBUG);
            await this.setupDatabase();
            const path = await this.database?.getPath()
            console.debug(`Database Setup with path: ${path}`);
            await this.setupIndexes();
            if (this.replicator === undefined) {
                await this.setupReplicator();
            }
            await this.replicator?.start(true);
        } catch (error) {
            console.log(`Error: ${error}`);
            throw error;
        }
    }

    /**
     * Sets up the database with the necessary configurations and collections.
     * @private
     * @throws Will throw an error if the database setup fails.
     */
    private async setupDatabase() {
        /* **
        * Note about encryption: In a real-world app, the encryption key
        * should not be hardcoded like it is here.

        * One strategy is to auto generate a unique encryption key per
        * user on initial app load, then store it securely in the
        * device's keychain for later retrieval.
        * **/
        const fileSystem = new FileSystem();
        const directoryPath = await fileSystem.getDefaultPath();

        const dc = new DatabaseConfiguration();
        dc.setDirectory(directoryPath);
        dc.setEncryptionKey('8e31f8f6-60bd-482a-9c70-69855dd02c39');

        this.database = new Database('travel', dc);

        await this.database.open();
        const collections = await this.database.collections();
        //check to see if we are missing the travel sample collections, if so then create them
        if (collections.length === 1) {
            await this.database.createCollection('airline', 'inventory');
            await this.database.createCollection('airport', 'inventory');
            await this.database.createCollection('hotel', 'inventory');
            await this.database.createCollection('landmark', 'inventory');
            await this.database.createCollection('route', 'inventory');
            await this.database.createCollection('users', 'tenant_agent_00')
            await this.database.createCollection('bookings', 'tenant_agent_00')
        }
    }

    /**
     * Sets up the indexes for the `hotel` collection in the database.
     *
     * This function creates the following indexes for the `hotel` collection:
     * - `idxTextSearch`: A full-text index on the `address`, `city`, `country`, and `description` fields.
     * - `idxVacancy`: A value index on the `vacancy` field.
     *
     * The full-text index (`idxTextSearch`) is configured to ignore accents.
     *
     * @private
     * @throws Will throw an error if the index creation fails.
     */
    private async setupHotelIndexes() {
        const hotelCollection = await this.database?.collection('hotel', 'inventory');
        //setup full text index for hotel collection
        const ipAddress = FullTextIndexItem.property("address");
        const ipCity = FullTextIndexItem.property("city");
        const ipCountry = FullTextIndexItem.property("country");
        const ipDescription = FullTextIndexItem.property("description");
        const idxFullTextSearch = IndexBuilder.fullTextIndex(ipAddress, ipCity, ipCountry, ipDescription).setIgnoreAccents(true);

        await hotelCollection?.createIndex("idxTextSearch", idxFullTextSearch);

        //setup index to filter hotels by vacancy
        const vacancyValueIndex = IndexBuilder.valueIndex(
            ValueIndexItem.property('vacancy'),
        );
        await hotelCollection?.createIndex('idxVacancy', vacancyValueIndex);
    }

    /**
     * Sets up the indexes for the `hotel` and `landmark` collections in the database.
     *
     * This function calls the `setupHotelIndexes` and `setupLandmarkIndexes` methods
     * to create the necessary indexes for the `hotel` and `landmark` collections.
     *
     * @private
     * @throws Will throw an error if the database is not initialized.
     */
    private async setupIndexes() {
        if (this.database !== undefined) {
            await this.setupHotelIndexes();
            await this.setupLandmarkIndexes();
        }
    }

    /**
     * Sets up the indexes for the `landmark` collection in the database.
     *
     * This function creates the following indexes for the `landmark` collection:
     * - `idxLandmarkActivity`: A value index on the `activity` and `name` fields to ensure only valid activities with names are indexed.
     * - `idxLandmarkTextSearch`: A value index on the `title`, `name`, `address`, `city`, `state`, `country`, and `activity` fields for text search.
     *
     * @private
     * @throws Will throw an error if the index creation fails.
     */
    private async setupLandmarkIndexes() {
        const landmarkCollection = await this.database?.collection('landmark', 'inventory');
        /*
        setup landmark activity index - we need to make sure we only grab activities that have names because the dataset is not clean and has some rubbish in it
         */
        const activityValueIndex = IndexBuilder.valueIndex(
            ValueIndexItem.property('activity'),
            ValueIndexItem.property('name'),
        );
        await landmarkCollection?.createIndex('idxLandmarkActivity', activityValueIndex);

        //standard indexed fields for text search
        const idxLandmarkTextSearch = IndexBuilder.valueIndex(
            ValueIndexItem.property('title'),
            ValueIndexItem.property('name'),
            ValueIndexItem.property('address'),
            ValueIndexItem.property('city'),
            ValueIndexItem.property('state'),
            ValueIndexItem.property('country'),
            ValueIndexItem.property('activity'),
        );
        await landmarkCollection?.createIndex('idxLandmarkTextSearch', idxLandmarkTextSearch);
    }

    /**
     * Sets up the replicator for the database.
     *
     * This function configures the replicator to synchronize the local database with a remote
     * Couchbase Sync Gateway or Capella App Service endpoint. It retrieves the collections
     * from the database and sets up the replicator with the specified target URL and authentication.
     *
     * The replicator is configured to run continuously and accept only self-signed certificates.
     *
     * @private
     * @throws Will throw an error if no collections are found to set the replicator to.
     */
    private async setupReplicator() {
        const collections = await this.getCollections();
        if (collections.length > 0) {

            //****************************************************************
            //YOU MUST CHANGE THIS TO YOUR LOCAL IP ADDRESS OR TO YOUR CAPELLA CONNECTION STRING
            //****************************************************************
            const targetUrl = new URLEndpoint('wss://xxxxxx.apps.cloud.couchbase.com:4984/travel-location');

            //****************************************************************
            //YOU MUST CREATE THIS USER IN YOUR SYNC GATEWAY CONFIGURATION OR CAPPELLA APP SERVICE ENDPOINT
            //****************************************************************
            const auth = new BasicAuthenticator('demo@example.com', 'P@ssw0rd12');

            const config = new ReplicatorConfiguration(targetUrl);
            config.addCollections(collections);
            config.setAuthenticator(auth);
            config.setContinuous(true);
            config.setAcceptOnlySelfSignedCerts(false);
            this.replicator = await Replicator.create(config);
        } else {
            throw new Error('No collections found to set replicator to');
        }
    }
}
  