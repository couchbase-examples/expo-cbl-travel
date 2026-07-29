const {
  withProjectBuildGradle,
  withXcodeProject,
  withPodfileProperties,
} = require('@expo/config-plugins');

const COUCHBASE_MAVEN_URL = 'https://mobile.maven.couchbase.com/maven2/dev/';

const MAVEN_REPO_BLOCK = `        maven {
            url '${COUCHBASE_MAVEN_URL}'
            content { includeGroupByRegex "com\\\\.couchbase.*" }
        }`;

// Legacy install step: `apply from: ".../couchbase-lite-react-native/android/build.gradle"`.
// Matched in any historical spelling (quote style / leading whitespace / path prefix).
const LEGACY_APPLY_FROM =
  /^[ \t]*apply from:\s*["'][^"']*couchbase-lite-react-native\/android\/build\.gradle["'][ \t]*\r?\n?/gm;

/**
 * Adds the Couchbase Maven repository to the root project's allprojects.repositories.
 * This repo is required to resolve `com.couchbase.lite:couchbase-lite-android-ee-ktx`.
 *
 * Why we no longer `apply from:` the library's android/build.gradle here:
 *   That file is the library *module* build script. Applying it to the app's ROOT
 *   project runs its `allprojects { }` block at the root, which forces sibling modules
 *   to be evaluated during root configuration. On AGP 8 / Gradle 9 that makes their own
 *   `namespace` assignment illegal and the build fails with:
 *
 *     A problem occurred evaluating project ':react-native-firebase_analytics'.
 *     > It is too late to set namespace
 *
 *   The native module is picked up by Expo/RN autolinking, so no root-level
 *   `apply from:` is needed — only the Maven repo. Any previously injected
 *   `apply from:` line is stripped below.
 */
function modifyAndroidBuildGradle(config) {
  if (config.modResults.language !== 'groovy') {
    console.warn(
      '[cbl-travel] Root build.gradle is not Groovy; add the Couchbase Maven repo manually.'
    );
    return config;
  }

  let contents = config.modResults.contents;

  // Remove the legacy root-level apply-from (namespace-ordering bug).
  contents = contents.replace(LEGACY_APPLY_FROM, '');

  // Idempotent: only inject the repo once.
  if (!contents.includes(COUCHBASE_MAVEN_URL)) {
    const allprojectsIndex = contents.search(/allprojects\s*\{/);
    if (allprojectsIndex !== -1) {
      const head = contents.slice(0, allprojectsIndex);
      const tail = contents.slice(allprojectsIndex);
      const anchor = /(repositories\s*\{[\s\S]*?(?:mavenCentral\(\)|google\(\)))/;
      if (anchor.test(tail)) {
        contents = head + tail.replace(anchor, `$1\n${MAVEN_REPO_BLOCK}`);
      }
    } else {
      contents += `
allprojects {
    repositories {
${MAVEN_REPO_BLOCK}
    }
}
`;
    }
  }

  config.modResults.contents = contents;
  return config;
}

// Function to modify iOS Xcode project
function modifyXcodeProject(config) {
  const xcodeProject = config.modResults;
  // Example modification: adding a build phase for a script
  // xcodeProject.addBuildPhase([], 'PBXShellScriptBuildPhase', 'Run Script', null, script);
  return config;
}

// Function to modify Podfile properties to include the native module podspec
function includeNativeModulePod(config) {
  return withPodfileProperties(config, async (podConfig) => {
    const podspecPath = `../node_modules/@couchbase/couchbase-lite-react-native/cbl-reactnative.podspec`;
    if (podConfig.modResults.podfileProperties !== undefined && podConfig.modResults.podfileProperties.pod !== undefined) {
      podConfig.modResults.podfileProperties.pod(
          `'cbl-reactnative', :path => '${podspecPath}'`
      );
    }
    return podConfig;
  });
}

module.exports = (config) => {
  config = withProjectBuildGradle(config, (gradleConfig) => {
    return modifyAndroidBuildGradle(gradleConfig);
  });
  config = withXcodeProject(config, (xcodeConfig) => {
    return modifyXcodeProject(xcodeConfig);
  });
  config = includeNativeModulePod(config);
  return config;
};
