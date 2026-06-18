const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  /.*\/cbl-reactnative\/node_modules\/react-native\/.*/,
  /.*\/cbl-reactnative\/node_modules\/react\/.*/,
];

module.exports = config;
