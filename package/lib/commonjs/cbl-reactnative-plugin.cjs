"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _configPlugins = require("@expo/config-plugins");
// Function to modify Android build.gradle
const modifyAndroidBuildGradle = config => {
  const lineToAdd = ` apply from: "../../android/build.gradle"`;
  // @ts-ignore
  if (!config.modResults.contents.includes(lineToAdd)) {
    // @ts-ignore
    config.modResults.contents += lineToAdd;
  }
  return config;
};

// Function to modify iOS Xcode project
const modifyXcodeProject = config => {
  const xcodeProject = config.modResults;
  // Example modification: adding a build phase for a script
  // xcodeProject.addBuildPhase([], 'PBXShellScriptBuildPhase', 'Run Script', null, script);
  return config;
};

// Function to modify Podfile properties to include the native module podspec
const includeNativeModulePod = config => {
  return (0, _configPlugins.withPodfileProperties)(config, async podConfig => {
    // Assuming the path to the podspec is relative to the iOS directory in the Expo app
    // Adjust the path as necessary based on your project structure
    const podspecPath = `../../cbl-reactnative.podspec`;
    // @ts-ignore
    podConfig.modResults.podfileProperties.pod(`'cbl-reactnative', :path => '${podspecPath}'`);
    return podConfig;
  });
};
const cblReactNative = config => {
  // @ts-ignore
  config = (0, _configPlugins.withProjectBuildGradle)(config, async gradleConfig => {
    // @ts-ignore
    return modifyAndroidBuildGradle(gradleConfig);
  });
  config = (0, _configPlugins.withXcodeProject)(config, async xcodeConfig => {
    return modifyXcodeProject(xcodeConfig);
  });
  return config;
};
var _default = exports.default = cblReactNative;
//# sourceMappingURL=cbl-reactnative-plugin.cjs.map