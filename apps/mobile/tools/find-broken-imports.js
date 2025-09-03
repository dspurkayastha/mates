const fs = require('fs');
const path = require('path');
const j = require('jscodeshift');

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
let hasErrors = false;

const exts = ['.js', '.jsx', '.ts', '.tsx'];
const platforms = ['', '.native', '.ios', '.android', '.web'];

function resolveImport(spec, filePath) {
  let base;
  if (spec.startsWith('@/')) {
    base = path.join(srcDir, spec.slice(2));
  } else if (spec.startsWith('.')) {
    base = path.resolve(path.dirname(filePath), spec);
  } else {
    return true; // external module
  }
  for (const plat of platforms) {
    for (const ext of exts) {
      const file = base + plat + ext;
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return true;
    }
  }
  for (const plat of platforms) {
    for (const ext of exts) {
      const file = path.join(base, 'index' + plat + ext);
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return true;
    }
  }
  return false;
}

function checkFile(file) {
  const source = fs.readFileSync(file, 'utf8');
  const ast = j.withParser('tsx')(source);
  ast.find(j.ImportDeclaration).forEach((p) => {
    const spec = p.value.source.value;
    if (!resolveImport(spec, file)) {
      const rel = path.relative(projectRoot, file);
      console.log(`${rel}: cannot resolve ${spec}`);
      hasErrors = true;
    }
  });
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (['__tests__', '__mocks__', 'node_modules'].includes(entry.name)) continue;
      walk(path.join(dir, entry.name));
    } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      checkFile(path.join(dir, entry.name));
    }
  }
}

walk(srcDir);
if (hasErrors) {
  process.exit(1);
}
