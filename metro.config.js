const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  /.*\/@couchbase\/couchbase-lite-react-native\/node_modules\/react-native\/.*/,
  /.*\/@couchbase\/couchbase-lite-react-native\/node_modules\/react\/.*/,
];

module.exports = config;
