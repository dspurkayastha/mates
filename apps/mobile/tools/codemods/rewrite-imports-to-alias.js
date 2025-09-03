const fs = require('fs');
const path = require('path');

function resolveFile(p) {
  const exts = ['.ts', '.tsx', '.js', '.jsx'];
  const platforms = ['', '.native', '.ios', '.android', '.web'];
  for (const plat of platforms) {
    for (const ext of exts) {
      const file = p + plat + ext;
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        return file;
      }
    }
  }
  for (const plat of platforms) {
    for (const ext of exts) {
      const file = path.join(p, 'index' + plat + ext);
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        return file;
      }
    }
  }
  return null;
}

module.exports = function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const filePath = fileInfo.path;
  const projectRoot = path.resolve(__dirname, '..', '..');
  const srcDir = path.join(projectRoot, 'src');
  const root = j(fileInfo.source);

  root.find(j.ImportDeclaration).forEach((p) => {
    const source = p.value.source.value;
    if (!source || source.startsWith('@/') || !source.startsWith('.')) {
      return;
    }
    const absolutePath = path.resolve(path.dirname(filePath), source);
    const resolved = resolveFile(absolutePath);
    if (!resolved) return;
    if (!resolved.startsWith(srcDir)) return;
    let rel = path.relative(srcDir, resolved).replace(/\\/g, '/');
    rel = rel.replace(/(\.native|\.ios|\.android|\.web)?\.(ts|tsx|js|jsx)$/i, '');
    rel = rel.replace(/\/index$/, '');
    p.value.source.value = `@/${rel}`;
  });

  return root.toSource({ quote: 'single' });
};

module.exports.parser = 'tsx';
