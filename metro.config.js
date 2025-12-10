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
];

// Add extra node modules to resolve
config.resolver.extraNodeModules = {
  'cbl-reactnative': cblReactNativePath,
};

// Exclude node_modules inside cbl-reactnative to avoid duplicate dependencies
config.resolver.blockList = [
  new RegExp(`${cblReactNativePath.replace(/[/\\]/g, '[/\\\\]')}/node_modules/.*`),
  new RegExp(`${cblReactNativePath.replace(/[/\\]/g, '[/\\\\]')}/expo-example/.*`),
];

module.exports = config;

