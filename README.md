# Couchbase Lite React Native - Expo Travel Sample App 👋

# Overview

This is an example app of a simple React Native app that uses the [Couchbase Lite](https://www.couchbase.com/products/lite) database. The app lists a set of Landmarks and Hotels that are provided as part of the [Couchbase Travel-Sample](https://docs.couchbase.com/cloud/get-started/run-first-queries.html) dataset. 

This app assumes you have a Capella Free Tier operational cluster with the travel-sample dataset installed. To find out more information about the free tier, please visit this blog post [Couchbase Cloud](https://www.couchbase.com/blog/free-tier-capella-dev-available/).

## Prerequisites

- **iOS**: iOS 15.0 or higher
- **Android**: Android SDK 24 (Android 7.0) or higher
- **Node.js**: Latest LTS version recommended
- **Expo CLI**: For running the development server

## Couchbase Lite Version

This application uses **Couchbase Lite 3.3** with the following modern APIs:

### Key Features
- **LogSinks API**: Modern logging configuration with `LogSinks.setConsole()` for flexible log management
- **CollectionConfiguration**: Constructor-based replicator setup with collection-specific configurations
- **Collection-based Replication**: Sync specific collections from your Capella App Services endpoint
- **Full-Text Search**: Implemented with `MATCH()` queries for hotel search functionality
- **Value Indexes**: Optimized query performance for landmark and hotel searches

### API Highlights
```typescript
// Modern logging with LogSinks
await LogSinks.setConsole({
  level: LogLevel.DEBUG,
  domains: [LogDomain.ALL]
});

// Collection-based replication
const collectionConfigs = collections.map(col => new CollectionConfiguration(col));
const config = new ReplicatorConfiguration(collectionConfigs, targetUrl);
```

## App Services Setup

Log into your Capella Free-Tier account. A listing of Operational Clusters should appear. Click on your demo-cluster in the listing. This should bring up the Home page for your cluster.

### Create a new App Service

On the Home tab under the `Explore your cluster` section find the section `Try App Services` and click on the link `Deploy App Services`.

On the main App Services page click the `Create App Service` button. The Create App Services page should appear.

On the Create App Services page, give your app service a name. You can name it anything you like, for example `demo-app-service`. Under the Linked Cluster section select `demo-cluster` from the pull-down select list. Finally, you can click the `Create App Service` button.

It will take between 5 and 25 minutes for your new App Service to be created. 

### Creating a new Endpoint

Once your cluster is created and the status is listed as `Healthy`, click on the newly created App Service name in the list, i.e. `demo-app-service`.

One the App Endpoints screen, click the `Create App Endpoint` button to create a new Endpoint.

On the Create App Endpoint page, enter the name `locations` in the App Endpoint Name field. In the Bucket selection list, select the `travel-sample` bucket. In the Scope selection list, select the `inventory` scope.

Under the `Choose collections to link` section, click the `Link` switch for both the `landmark` and `hotel` collections. This will link those two collections to this App Endpoint allowing us to sync data from those collections to our mobile app.  

Finally, click the `Create App Endpoint` button. The App Endpoints listing page should appear.

### Setup App Endpoint Security

On the App Endpoints listing page, click on the newly created endpoint `locations`. This will bring up the App Endpoint section of Capella App Services. 

On the Security page the Access and Validation screen should appear. A message on this page states that the App Endpoint is paused. Click the `Resume app endpoint` link to resume the endpoint. This may take a few seconds to complete.

We are going to use the default Access Control and Data Validation scripts, so click the `App Users` tab from the navigation menu on the left.

On the App Users page, click the `Create App User` button. This will bring up the Create App User page. Enter a username and password for the new user. For this example, you can use `demo@example.com` for the username and `P@ssw0rd12` for the password.

Click the `Configure Access Grants` link to expand the grants section. Under the `Assign Channels` section locate the `hotel` listing under `LINKED COLLECTIONS` and add an Admin Channel name of `hotel` and hit the enter key. It should show the name in a chip format. Now locate the `landmark` listing under `LINKED COLLECTIONS` and add an Admin Channel name of `landmark` and hit the enter key. It should show the name in a chip format. This will give the new user access to the `hotel` and `landmark` collections.

Click the `Create App User` button to create the new user.

### Setup Delta Sync (optional)

Click on the `Settings` tab on the top navigation menu. From the `App Endpoint Settings` screen click on the `Delta Sync` tab located in the CONFIGURATION menu on the left side of the page.  

Click the `Enable Delta Sync` switch to enable Delta Sync. Click the `Save` button to save the changes.

### Get the Endpoint URL 

Click on the `Connect` tab on the navigation menu in the header of the page. The Connect page should appear. The URL for the App Endpoint is listed in the `Public Connection` section. You will need this URL to connect the mobile app to the App Endpoint. Click the two sheets of paper (copy) button next to the public connection string in order to copy the URL to your clipboard on your computer. We can then paste in the URL into the configuration.

## Pull down the code

From a terminal you can use the git command to pull down the code from the repository:

```bash
git clone https://github.com/couchbase-examples/couchbase-tutorials.git
cd expo-cbl-travel
```

## Set up the Mobile App 

To set up the mobile app, first install the npm dependencies from the terminal:

```bash
npm install
```

### Update the Configuration

**IMPORTANT: Security Best Practices**

⚠️ **Never commit sensitive credentials to version control!**

The `app.json` file in this repository contains placeholder values. You have two options to configure your credentials:

#### Option 1: Local Configuration (Recommended)
1. Copy `app.config.example.json` to create your local configuration
2. Update the values in `app.json` with your actual credentials
3. Make sure `app.json` is never committed with real credentials

#### Option 2: Environment Variables
Create a `.env.local` file with your credentials (this file is ignored by git):
```bash
CAPELLA_ENDPOINT_URL=wss://your-endpoint.apps.cloud.couchbase.com:4984/your-database
CAPELLA_USERNAME=your-username@example.com
CAPELLA_PASSWORD=your-secure-password
```

Open the `app.json` file and locate the `extra` section at the bottom. You will need to update three configuration values:

```json
"extra": {
  "capellaEndpointUrl": "REPLACE_WITH_YOUR_CAPELLA_ENDPOINT",
  "capellaUsername": "REPLACE_WITH_YOUR_USERNAME",
  "capellaPassword": "REPLACE_WITH_YOUR_PASSWORD"
}
```

Replace the following values:

1. **capellaEndpointUrl**: Paste the connection string you copied from your Capella App Services endpoint (from the setup steps above)
2. **capellaUsername**: Enter the username you created in the App Users section
3. **capellaPassword**: Enter the password you created for that user

**Example:**
```json
"extra": {
  "capellaEndpointUrl": "wss://abcd1234.apps.cloud.couchbase.com:4984/locations",
  "capellaUsername": "demo@example.com",
  "capellaPassword": "P@ssw0rd12"
}
```

### Running the app

#### iOS Setup

**Prerequisites:**
- macOS with Xcode installed
- CocoaPods installed (`sudo gem install cocoapods`)
- iOS 15.0+ simulator or device

**Steps:**
1. Install iOS dependencies:
```bash
cd ios && pod install && cd ..
```

2. Run the iOS app:
```bash
npx expo run:ios
```

Or use the Expo development server:
```bash
npm run start
# Then press 'i' to open iOS simulator
```

#### Android Setup

**Prerequisites:**
- Android Studio installed
- Android SDK 24 (Android 7.0) or higher
- Android emulator or physical device

**Steps:**
1. Run the Android app:
```bash
npx expo run:android
```

Or use the Expo development server:
```bash
npm run start
# Then press 'a' to open Android emulator
```

#### Development Server

To run an expo development server with more options:

```bash
npm run start
```

In the output, you'll find options to open the app in an iOS simulator or Android emulator.

More information on developing mobile apps with Expo can be found in the links below:
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

## Features

This sample app demonstrates the following Couchbase Lite features:

### Database Operations
- **Database Creation**: Encrypted local database with `DatabaseConfiguration`
- **Collections**: Organized data into scoped collections (`inventory.hotel` and `inventory.landmark`)
- **Indexing**: Full-text search indexes and value indexes for optimized queries

### Queries
- **SQL++ Queries**: Using Couchbase's powerful SQL++ query language
- **Full-Text Search**: Find hotels using the `MATCH()` function
- **Filtered Queries**: Search landmarks by name, location, and activity type

### Replication
- **Bi-directional Sync**: Real-time synchronization with Capella App Services
- **Collection-based Replication**: Selective sync of specific collections
- **Continuous Replication**: Automatic background synchronization
- **Authentication**: Secure connection with BasicAuthenticator

### Logging
- **LogSinks API**: Modern, flexible logging configuration
- **Console Logging**: Debug output for development and troubleshooting

## Project Structure

```
expo-cbl-travel/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── index.tsx        # Landmarks screen
│   │   └── hotel.tsx        # Hotels screen
│   └── _layout.tsx          # Root layout
├── components/              # Reusable React components
├── hooks/                   # Custom React hooks
│   ├── getHotels.ts        # Hook for fetching hotels
│   ├── getLandmarks.ts     # Hook for fetching landmarks
│   └── startLogging.ts     # Logging configuration
├── providers/              # React Context providers
│   └── DatabaseProvider.tsx # Database initialization context
├── services/               # Business logic services
│   └── database.service.ts # Core database operations
├── models/                 # TypeScript interfaces
└── app.json               # Expo and app configuration
```

## Learn more

To learn more about Couchbase Lite and React Native, look at the following resources:
- [cbl-reactnative documentation](https://cbl-reactnative.dev/)
- [Couchbase Lite Documentation](https://docs.couchbase.com/couchbase-lite/current/introduction.html)

To learn more about Expo, look at the following resources:
- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers:

- [Discord community](https://bit.ly/3NbK5vg): Chat with Couchbase developers and ask questions.
- [Stack Overflow community](https://stackoverflow.com/tags/couchbase/info/): Ask questions.
- [Developer Portal](https://www.couchbase.com/developer): More information including tutorials and learning paths.
