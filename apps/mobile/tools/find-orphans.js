const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const appDir = path.join(root, 'src', 'app');
const screensDir = path.join(root, 'src', 'screens');

const REQUIRED_ROUTES = new Set([
  '(tabs)/_layout',
  '(tabs)/index',
  '(tabs)/analytics',
  '(tabs)/profile',
  '(tabs)/settings',
  '(tabs)/expenses',
  '(tabs)/groceries',
  '(tabs)/chores',
  'polls/create',
  'polls/[id]',
  '+not-found',
]);

const exts = ['.js', '.jsx', '.ts', '.tsx'];

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('__')) continue;
      results = results.concat(walk(res));
    } else if (exts.includes(path.extname(entry.name))) {
      results.push(res);
    }
  }
  return results;
}

function stripExt(p) {
  // remove extension
  return p.slice(0, -path.extname(p).length);
}

function relFromApp(p) {
  return path.relative(appDir, p).replace(/\\+/g, '/');
}

function relFromRoot(p) {
  return path.relative(root, p).replace(/\\+/g, '/');
}

// gather route files to evaluate
const routeFiles = walk(appDir).filter((f) => {
  const r = relFromApp(f);
  return (
    r.startsWith('(tabs)/') ||
    r.startsWith('polls/') ||
    path.basename(r).startsWith('+not-found') ||
    path.basename(r).startsWith('_layout')
  );
});

function isReachable(file) {
  const rel = stripExt(relFromApp(file));
  if (REQUIRED_ROUTES.has(rel)) return true;
  if (rel.startsWith('(tabs)/')) return true;
  if (rel.startsWith('polls/')) return ['polls/create', 'polls/[id]'].includes(rel);
  if (path.basename(rel).startsWith('_layout')) return true;
  if (rel === '+not-found') return true;
  return false;
}

// detect orphan route files
const orphanRoutes = routeFiles.filter((f) => !isReachable(f));

// gather legacy screens
const screenFiles = walk(screensDir).filter((f) => {
  const content = fs.readFileSync(f, 'utf8');
  return /export\s+default/.test(content);
});

// read all route file contents to see imports
const allRouteFiles = walk(appDir);
const routeContents = allRouteFiles.map((f) => fs.readFileSync(f, 'utf8'));

const usedScreens = new Set();

for (const screen of screenFiles) {
  const name = path.basename(screen).replace(/\.[tj]sx?$/, '');
  const needle = `screens/${name}`;
  if (routeContents.some((c) => c.includes(needle))) {
    usedScreens.add(screen);
  }
}

const orphanScreens = screenFiles.filter((f) => !usedScreens.has(f));

const orphans = [...orphanRoutes, ...orphanScreens].map(relFromRoot).sort();

if (orphans.length) {
  for (const o of orphans) {
    console.log(o);
  }
  process.exitCode = 1;
}
