/**
 * Gradle builds can leave duplicate android/bin trees inside expo modules.
 * Autolinking then registers each Package twice and expo-dev-launcher crashes on launch.
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const nodeModulesDir = path.join(projectRoot, 'node_modules');

if (!fs.existsSync(nodeModulesDir)) {
  process.exit(0);
}

let removed = 0;

for (const entry of fs.readdirSync(nodeModulesDir)) {
  if (!entry.startsWith('expo-') && entry !== 'expo') {
    continue;
  }

  const binDir = path.join(nodeModulesDir, entry, 'android', 'bin');
  if (fs.existsSync(binDir)) {
    fs.rmSync(binDir, { recursive: true, force: true });
    removed += 1;
  }
}

const generatedPackageListDir = path.join(
  nodeModulesDir,
  'expo',
  'android',
  'build',
  'generated'
);

if (fs.existsSync(generatedPackageListDir)) {
  fs.rmSync(generatedPackageListDir, { recursive: true, force: true });
}

if (removed > 0) {
  console.log(`Removed stale android/bin from ${removed} expo module(s).`);
}
