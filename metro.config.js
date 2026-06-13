const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const cblReactNativePath = path.resolve(__dirname, '../cbl-reactnative');

config.watchFolders = [cblReactNativePath];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(cblReactNativePath, 'node_modules'),
];
config.resolver.extraNodeModules = {
  'cbl-reactnative': cblReactNativePath,
};
config.resolver.unstable_enableSymlinks = true;
config.resolver.blockList = [
  /.*\/cbl-reactnative\/node_modules\/react-native\/.*/,
  /.*\/cbl-reactnative\/node_modules\/react\/.*/,
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
