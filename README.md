# Couchbase Lite React Native - Expo Travel Sample App 👋

# Overview

This is an example app of a simple React Native app that uses the [Couchbase Lite](https://www.couchbase.com/products/lite) database. The app lists a set of Landmarks and Hotels that are provided as part of the [Couchbase Travel-Sample](https://docs.couchbase.com/cloud/get-started/run-first-queries.html) dataset. 

This app assumes you have a Capella Free Tier operational cluster with the travel-sample dataset installed.  To find out more information about the free tier, please visit this blog post [Couchbase Cloud](https://www.couchbase.com/blog/free-tier-capella-dev-available/).

## App Services Setup
Log into your Capella Free-Tier account.  A listing of Operational Clusters should appear.  Click on your demo-cluster in the listing.  This should bring up the Home page for your cluster.

### Create a new App Service
On the Home tab under the `Explore your cluster` section find the section `Try App Services` and click on the link `Deploy App Services`.

On the main App Services page click the `Create App Service` button.  The Create App Services page should appear.

On the Create App Services page, give your app service a name.  You can name it anything you like, for example `demo-app-service`.  Under the Linked Cluster section select `demo-cluster` from the pull-down select list.  Finally, you can click the `Create App Service` button.

It will take between 5 and 25 minutes for your new App Service to be created. 

### Creating a new Endpoint

Once your cluster is created and the status is listed as `Healthy`, click on the newly created App Service name in the list , i.e. `demo-app-service`.

One the App Endpoints screen, click the `Create App Endpoint` button to create a new Endpoint.

On the Create App Endpoint page, enter the name `locations` in the App Endpoint Name field.  In the Bucket selection list, select the `travel-sample` bucket.  In the Scope selection list, select the `inventory` scope.

Under the `Chose collections to link` section, click the `Link` switch for both the `landmark` and `hotel` collections.  This will link those two collections to this App Endpoint allow us to sync data from those collections to our mobile app.  

Finally, click the `Create App Endpoint` button.  The App Endpoints listing page should appear.

### Setup App Endpoint Security
On the App Endpoints listing page, click on the newly created endpoint `locations`.  This will bring up the App Endpoint section of Capella App Services. 

On the Security page the Access and Validation screen should appear.  A message on this page states that the App Endpoint is paused.  Click the `Resume app endpoint` link to resume the endpoint.   This may take a few seconds to complete.

We are going to use the default  Access Control and Data Validation scripts, so click the `App Users` tab from the navigation menu on the left.

On the App Users page, click the `Create App User` button.  This will bring up the Create App User page.  Enter a username and password for the new user.  For this example, you can use `demo@example.com` for the username and `P@ssw0rd12` for the password which are hard coded in the mobile app code.  

Click the `Configure Access Grants` link to expand the grants section.  Under the `Assign Channels` section locate the `hotel` listing under `LINKED COLLECTIONS`  and add an Admin Channel name of `hotel` and hit the enter key. It should show the name in a chip format.  Now locate the `landmark` listing under `LINKED COLLECTIONS` and add an Admin Channel name of `landmark` and hit the enter key.  It should show the name in a chip format.  This will give the new user access to the `hotel` and `landmark` collections.
Click the `Create App User` button to create the new user.

### Setup Delta Sync (optional)
Click on the `Settings` tab on the top navigation menu.  Fom the `App Endpoint Settings` screen click on the `Delta Sync` tab located in the CONFIGURATION menu on the left side of the page.  

Click the `Enable Delta Sync` switch to enable Delta Sync.  Click the `Save` button to save the changes.

### Get the Endpoint URL 

Click on the `Connect` tab on the navigation menu in the header of the page.  The Connect page should appear.  The URL for the App Endpoint is listed in the `Public Connection` section.  You will need this URL to connect the mobile app to the App Endpoint.  Click the two sheets of paper (copy) button next to the public connection string in order to copy the URL to your clipboard on your computer.  We can then paste in the URL into the code.

## Pull down the code
From a terminal you can use the git command to pull down the code from the repository:

```bash
git clone https://github.com/couchbase-examples/couchbase-tutorials.git
cd expo-cbl-travel
````

## Set up the Mobile App 

To set up the mobile app, first install the npm dependencies from the terminal:

```bash
npm install
```

### Update the configuration
Open the `services/database.service.ts` file and locate the `setupReplicator` function.  You will be required to update the `targetUrl` variable with the connection string to your Couchbase App Services Endpoint connection string.  Paste in the value that you copied from the directions above into the `targetUrl` variable string value.  

```typescript 
const targetUrl = new URLEndpoint('wss://xxxxxx.apps.cloud.couchbase.com:4984/travel-location');
```

### Running the app
To run an expo app, you can use the following command:

```bash
npm run start
```

In the output, you'll find options to open the app in a iOS simulator, or Android emulator.

More Information on developing mobile apps on Expo can be found in the links below:
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

## Learn more

To learn more about Couchbase Lite and React Native, look at the following resources:
- [cbl-reactnative documentation](https://cbl-reactnative.dev/)

To learn more about Expo, look at the following resources:
- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers 

- [Discord community](https://bit.ly/3NbK5vg): Chat with Couchbase developers and ask questions.
- [Stack Overflow community](https://stackoverflow.com/tags/couchbase/info/): Ask questions.
- [Developer Portal](https://www.couchbase.com/developer): more information including tutorials and learning paths. 
