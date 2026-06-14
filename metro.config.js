const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const cblReactNativePath = path.resolve(__dirname, '../cbl-reactnative');

config.watchFolders = [cblReactNativePath];

config.resolver.extraNodeModules = new Proxy(
  {
    'cbl-reactnative': cblReactNativePath,
  },
  {
    get: (target, name) => {
      if (Object.prototype.hasOwnProperty.call(target, name)) {
        return target[name];
      }
      return path.join(__dirname, 'node_modules', name);
    },
  }
);

config.resolver.unstable_enableSymlinks = true;
config.resolver.blockList = [
  /.*\/cbl-reactnative\/node_modules\/react-native\/.*/,
  /.*\/cbl-reactnative\/node_modules\/react\/.*/,
  /.*\/cbl-reactnative\/expo-example\/.*/,
  /.*\/cbl-reactnative\/couchbase-lite-ios\/.*/,
  /.*\/cbl-reactnative\/cbl-reactnative-docs\/.*/,
  /.*\/cbl-reactnative\/ios-swift-quickstart\/.*/,
];

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    /\/lib\/(commonjs|module)\//.test(context.originModulePath) &&
    moduleName.startsWith('./cblite-js/')
  ) {
    const suffix = moduleName
      .slice('./cblite-js/'.length)
      .replace(/\.js$/, '');
    const sourcePath = path.resolve(
      cblReactNativePath,
      'cblite-js-common',
      'cblite-js',
      suffix
    );
    return context.resolveRequest(context, sourcePath, platform);
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
