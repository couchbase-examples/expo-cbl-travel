const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Path to your local cbl-reactnative package
const cblReactNativePath = path.resolve(__dirname, '../cbl-reactnative');

// Add the local package to watchFolders so Metro watches it for changes
config.watchFolders = [cblReactNativePath];

// Configure the resolver to find the local package
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(cblReactNativePath, 'node_modules'),
];

// Add extra node modules to resolve - point to the lib folder
config.resolver.extraNodeModules = new Proxy(
  {
    'cbl-reactnative': cblReactNativePath,
  },
  {
    get: (target, name) => {
      if (target.hasOwnProperty(name)) {
        return target[name];
      }
      // Fallback to the project's node_modules
      return path.join(__dirname, 'node_modules', name);
    },
  }
);

// Exclude problematic directories to avoid duplicate dependencies and recursive symlinks
config.resolver.blockList = [
  /.*\/cbl-reactnative\/node_modules\/react-native\/.*/,
  /.*\/cbl-reactnative\/node_modules\/react\/.*/,
  /.*\/cbl-reactnative\/expo-example\/.*/,
  /.*\/cbl-reactnative\/couchbase-lite-ios\/.*/,
  /.*\/cbl-reactnative\/cbl-reactnative-docs\/.*/,
  /.*\/cbl-reactnative\/ios-swift-quickstart\/.*/,
];

// Enable symlinks
config.resolver.unstable_enableSymlinks = true;

module.exports = config;

