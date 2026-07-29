#!/usr/bin/env node
/**
 * sync-cbl-sdk.js
 *
 * Copies your LOCAL @couchbase/couchbase-lite-react-native working copy into this
 * app's node_modules, so you can test unpublished SDK fixes without publishing to npm.
 *
 * Usage:
 *   npm run sync-cbl                      # sync using auto-detected SDK path
 *   npm run sync-cbl:check                # show what differs, change nothing
 *   node scripts/sync-cbl-sdk.js --src=/path/to/cbl-reactnative
 *   node scripts/sync-cbl-sdk.js --dry-run
 *   node scripts/sync-cbl-sdk.js --clean  # also wipe native build caches (see below)
 *   CBL_SDK_PATH=/path/to/cbl-reactnative npm run sync-cbl
 *
 * Source resolution order:
 *   1. --src=<path>
 *   2. $CBL_SDK_PATH
 *   3. First match among the DEFAULT_SDK_LOCATIONS below
 *
 * What gets copied: the same paths npm would publish (package.json "files"), i.e.
 * src, lib, android, ios, cblite-js-common/{cbl-js-swift,cbl-js-kotlin}, app.plugin.js
 * and the podspec. Build outputs, node_modules, tests and VCS metadata are skipped.
 *
 * IMPORTANT — after syncing:
 *   • JS/TS changes live in the SDK's lib/ (the compiled output), NOT src/. If you
 *     edited TypeScript in the SDK, run its build first (npm run prepare) or this
 *     script's staleness warning will tell you lib/ is older than src/.
 *   • Native changes need a rebuild, not just a Metro reload:
 *       iOS      → npx pod-install ios && npm run ios
 *       Android  → npm run android
 *   • `npm install` overwrites node_modules — re-run this script afterwards.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const PKG_NAME = '@couchbase/couchbase-lite-react-native';
const PROJECT_ROOT = path.join(__dirname, '..');
const DEST = path.join(PROJECT_ROOT, 'node_modules', PKG_NAME);

// Candidate locations for a local SDK checkout, tried in order.
const DEFAULT_SDK_LOCATIONS = [
  path.join(PROJECT_ROOT, '..', 'cbl-reactnative'),
  path.join(PROJECT_ROOT, '..', 'couchbase-lite-react-native'),
  path.join(os.homedir(), 'Desktop', 'cbl-reactnative'),
  path.join(os.homedir(), 'projects', 'cbl-reactnative'),
];

// Paths (relative to the SDK root) that are copied into node_modules.
const SYNC_PATHS = [
  'src',
  'lib',
  'android',
  'ios',
  'cblite-js-common/cbl-js-swift',
  'cblite-js-common/cbl-js-kotlin',
  'app.plugin.js',
  'cbl-reactnative.podspec',
  'package.json',
];

// Directory / file names never copied, anywhere in the tree.
const SKIP_NAMES = new Set([
  'node_modules',
  'build',
  'bin',
  '__tests__',
  '__fixtures__',
  '__mocks__',
  'local.properties',
]);

// Paths (relative to the SDK root) never copied. Mirrors the package.json "files"
// negations so node_modules ends up matching what `npm publish` would produce.
const SKIP_RELATIVE = new Set([
  'android/gradle',
  'android/gradlew',
  'android/gradlew.bat',
  'android/local.properties',
  'android/build',
  'ios/build',
]);

// package.json "files" also excludes "!**/.*" — every dotfile and dot-directory.
const isDotEntry = (name) => name.startsWith('.');

// ---------------------------------------------------------------- args

const argv = process.argv.slice(2);
const hasFlag = (f) => argv.includes(f);
const getOpt = (name) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};

const DRY_RUN = hasFlag('--dry-run');
const CHECK_ONLY = hasFlag('--check');
const CLEAN = hasFlag('--clean');
const VERBOSE = hasFlag('--verbose') || hasFlag('-v');

// ---------------------------------------------------------------- logging

const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};
const log = (m = '') => console.log(m);
const info = (m) => console.log(`${c.cyan}•${c.reset} ${m}`);
const ok = (m) => console.log(`${c.green}✓${c.reset} ${m}`);
const warn = (m) => console.log(`${c.yellow}!${c.reset} ${m}`);
const fail = (m) => console.error(`${c.red}✗${c.reset} ${m}`);

// ---------------------------------------------------------------- helpers

function resolveSdkRoot() {
  const explicit = getOpt('src') || process.env.CBL_SDK_PATH;
  const candidates = explicit ? [explicit] : DEFAULT_SDK_LOCATIONS;

  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (isSdkCheckout(resolved)) return resolved;
  }

  fail('Could not locate a local cbl-reactnative checkout.');
  log('');
  log('  Looked in:');
  for (const candidate of candidates) {
    log(`    ${c.dim}${path.resolve(candidate)}${c.reset}`);
  }
  log('');
  log('  Point at it explicitly:');
  log(`    ${c.bold}node scripts/sync-cbl-sdk.js --src=/path/to/cbl-reactnative${c.reset}`);
  log(`    ${c.bold}CBL_SDK_PATH=/path/to/cbl-reactnative npm run sync-cbl${c.reset}`);
  process.exit(1);
}

function isSdkCheckout(dir) {
  try {
    const pkgPath = path.join(dir, 'package.json');
    if (!fs.existsSync(pkgPath)) return false;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.name === PKG_NAME;
  } catch {
    return false;
  }
}

function newestMtime(target) {
  let newest = 0;
  const walk = (p) => {
    let st;
    try {
      st = fs.statSync(p);
    } catch {
      return;
    }
    if (st.isDirectory()) {
      if (SKIP_NAMES.has(path.basename(p))) return;
      for (const entry of fs.readdirSync(p)) walk(path.join(p, entry));
    } else {
      newest = Math.max(newest, st.mtimeMs);
    }
  };
  walk(target);
  return newest;
}

/** Recursively compare/copy. Returns {copied, unchanged, skipped}. */
function syncPath(relPath, srcRoot, destRoot, stats) {
  const src = path.join(srcRoot, relPath);
  const dest = path.join(destRoot, relPath);

  // Normalise to forward slashes so SKIP_RELATIVE matches on every platform.
  const relKey = relPath.split(path.sep).join('/');
  if (SKIP_RELATIVE.has(relKey)) return;

  if (!fs.existsSync(src)) {
    stats.missing.push(relPath);
    return;
  }

  const st = fs.statSync(src);

  if (st.isDirectory()) {
    if (SKIP_NAMES.has(path.basename(src))) return;
    if (!CHECK_ONLY && !DRY_RUN && !fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const entry of fs.readdirSync(src)) {
      if (SKIP_NAMES.has(entry) || isDotEntry(entry)) continue;
      syncPath(path.join(relPath, entry), srcRoot, destRoot, stats);
    }
    return;
  }

  // File: compare contents so the report only lists real changes.
  let identical = false;
  if (fs.existsSync(dest)) {
    try {
      identical = fs.readFileSync(src).equals(fs.readFileSync(dest));
    } catch {
      identical = false;
    }
  }

  if (identical) {
    stats.unchanged += 1;
    return;
  }

  stats.changed.push(relPath);

  if (!CHECK_ONLY && !DRY_RUN) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function rmrf(target, label) {
  if (!fs.existsSync(target)) return false;
  if (!CHECK_ONLY && !DRY_RUN) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  info(`cleaned ${label}`);
  return true;
}

// ---------------------------------------------------------------- main

function main() {
  const srcRoot = resolveSdkRoot();

  log('');
  log(`${c.bold}Sync local Couchbase Lite SDK → node_modules${c.reset}`);
  log(`  from: ${srcRoot}`);
  log(`  to:   ${DEST}`);
  if (CHECK_ONLY) log(`  mode: ${c.yellow}check only (no writes)${c.reset}`);
  else if (DRY_RUN) log(`  mode: ${c.yellow}dry run (no writes)${c.reset}`);
  log('');

  if (!fs.existsSync(DEST)) {
    fail(`${PKG_NAME} is not installed in node_modules.`);
    log(`  Run ${c.bold}npm install${c.reset} first, then re-run this script.`);
    process.exit(1);
  }

  // Report which SDK version/branch we're syncing from.
  try {
    const srcPkg = JSON.parse(fs.readFileSync(path.join(srcRoot, 'package.json'), 'utf8'));
    const destPkg = JSON.parse(fs.readFileSync(path.join(DEST, 'package.json'), 'utf8'));
    info(`local SDK version ${srcPkg.version}  →  installed ${destPkg.version}`);
  } catch {
    /* non-fatal */
  }

  // Warn if the compiled output is older than the TypeScript sources.
  const srcDir = path.join(srcRoot, 'src');
  const libDir = path.join(srcRoot, 'lib');
  if (fs.existsSync(srcDir) && fs.existsSync(libDir)) {
    if (newestMtime(srcDir) > newestMtime(libDir)) {
      warn(
        'SDK src/ is newer than lib/ — JS changes will NOT be picked up until you ' +
          'rebuild the SDK (run `npm run prepare` in the SDK repo).'
      );
    }
  } else if (!fs.existsSync(libDir)) {
    warn('SDK has no lib/ directory — build the SDK first (`npm run prepare`).');
  }

  const stats = { changed: [], unchanged: 0, missing: [] };
  for (const p of SYNC_PATHS) {
    syncPath(p, srcRoot, DEST, stats);
  }

  log('');
  if (stats.changed.length === 0) {
    ok(`Already in sync (${stats.unchanged} files identical).`);
  } else {
    const verb = CHECK_ONLY || DRY_RUN ? 'would update' : 'updated';
    ok(`${verb} ${stats.changed.length} file(s); ${stats.unchanged} unchanged.`);
    const show = VERBOSE ? stats.changed : stats.changed.slice(0, 25);
    for (const f of show) log(`    ${c.dim}${f}${c.reset}`);
    if (!VERBOSE && stats.changed.length > show.length) {
      log(`    ${c.dim}… and ${stats.changed.length - show.length} more (use --verbose)${c.reset}`);
    }
  }

  if (stats.missing.length) {
    log('');
    warn(`not present in the SDK checkout (skipped): ${stats.missing.join(', ')}`);
  }

  // Stale native build outputs make Gradle/Xcode reuse the OLD compiled code.
  if (CLEAN) {
    log('');
    info('cleaning native build caches…');
    rmrf(path.join(DEST, 'android', 'build'), 'node_modules SDK android/build');
    rmrf(path.join(PROJECT_ROOT, 'android', 'build'), 'app android/build');
    rmrf(path.join(PROJECT_ROOT, 'android', '.gradle'), 'app android/.gradle');
    rmrf(path.join(PROJECT_ROOT, 'ios', 'build'), 'app ios/build');
  }

  const touchedNative = stats.changed.some(
    (f) => f.startsWith('android') || f.startsWith('ios') || f.startsWith('cblite-js-common')
  );
  const touchedJs = stats.changed.some((f) => f.startsWith('lib') || f.startsWith('src'));

  if (!CHECK_ONLY && !DRY_RUN && stats.changed.length) {
    log('');
    log(`${c.bold}Next steps${c.reset}`);
    if (touchedNative) {
      log(`  iOS      ${c.dim}npx pod-install ios && npm run ios${c.reset}`);
      log(`  Android  ${c.dim}npm run android${c.reset}`);
      if (!CLEAN) {
        log(`  ${c.dim}(add --clean to wipe stale Gradle/Xcode build caches first)${c.reset}`);
      }
    }
    if (touchedJs) {
      log(`  JS       ${c.dim}restart Metro with a cleared cache: npx expo start -c${c.reset}`);
    }
  }
  log('');
}

main();
