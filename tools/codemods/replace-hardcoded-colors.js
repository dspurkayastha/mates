const { parse } = require('path');

module.exports = function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let hasUseColorsImport = false;
  root.find(j.ImportDeclaration).forEach((path) => {
    path.value.specifiers.forEach((s) => {
      if (s.type === 'ImportSpecifier' && s.imported.name === 'useColors') {
        hasUseColorsImport = true;
      }
    });
  });

  let insertedColorsHook = false;

  const addColorsHook = () => {
    if (insertedColorsHook) return;
    const body = root.get().value.program.body;
    const firstImport = body.filter((n) => n.type === 'ImportDeclaration').pop();
    const stmt = j.variableDeclaration('const', [
      j.variableDeclarator(j.identifier('colors'), j.callExpression(j.identifier('useColors'), [])),
    ]);
    if (firstImport) {
      root.get().value.program.body.splice(body.indexOf(firstImport) + 1, 0, stmt);
    } else {
      root.get().value.program.body.unshift(stmt);
    }
    insertedColorsHook = true;
  };

  const replaceColor = (node, keyName) => {
    const val = node.value.value.toLowerCase();
    const isText = keyName === 'color';
    if (!hasUseColorsImport) {
      const importDecl = j.importDeclaration(
        [j.importSpecifier(j.identifier('useColors'))],
        j.literal('@/design-system/ThemeProvider')
      );
      root.get().value.program.body.unshift(importDecl);
      hasUseColorsImport = true;
    }
    addColorsHook();
    if ((val === '#000' || val === 'black')) {
      node.value = j.identifier(isText ? 'colors.text.primary' : 'colors.background.primary');
      return true;
    }
    if ((val === '#fff' || val === 'white')) {
      node.value = j.identifier(isText ? 'colors.text.inverse' : 'colors.background.primary');
      return true;
    }
    return false;
  };

  let transformed = false;

  root.find(j.ObjectExpression).forEach((path) => {
    path.value.properties.forEach((prop) => {
      if (prop.type !== 'Property') return;
      const keyName = prop.key.name || prop.key.value;
      if (!['color', 'backgroundColor', 'borderColor', 'shadowColor'].includes(keyName)) return;
      if (prop.value.type === 'Literal' && typeof prop.value.value === 'string') {
        const low = prop.value.value.toLowerCase();
        if (['#000', 'black', '#fff', 'white'].includes(low)) {
          if (replaceColor(prop, keyName)) transformed = true;
        } else {
          const comments = [
            j.commentLine(' TODO(theme): map to token'),
            j.commentLine(' eslint-disable-next-line local/no-hardcoded-colors'),
          ];
          prop.comments = (prop.comments || []).concat(comments);
        }
      }
    });
  });

  return transformed ? root.toSource() : null;
};
