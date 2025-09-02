const THEME_PATH = '@/design-system/ThemeProvider';

function memberFromPath(j, parts) {
  const segs = Array.isArray(parts) ? parts : String(parts).split('.');
  return segs.slice(1).reduce(
    (acc, key) => j.memberExpression(acc, j.identifier(key)),
    j.identifier(segs[0])
  );
}

function callWithOpacity(j, basePath, alpha) {
  return j.callExpression(j.identifier('withOpacity'), [
    memberFromPath(j, basePath),
    j.literal(alpha),
  ]);
}

module.exports = function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  let themeImport = null;
  root
    .find(j.ImportDeclaration, { source: { value: THEME_PATH } })
    .forEach((p) => {
      themeImport = themeImport || p.value;
    });

  function ensureThemeImport(name) {
    if (themeImport) {
      const has = themeImport.specifiers.some(
        (s) => s.imported && s.imported.name === name
      );
      if (!has) themeImport.specifiers.push(j.importSpecifier(j.identifier(name)));
    } else {
      themeImport = j.importDeclaration(
        [j.importSpecifier(j.identifier(name))],
        j.literal(THEME_PATH)
      );
      root.get().value.program.body.unshift(themeImport);
    }
  }

  function hasColorsVar(funcPath) {
    let found = false;
    j(funcPath)
      .find(j.VariableDeclarator)
      .forEach((d) => {
        const init = d.value.init;
        if (
          init &&
          init.type === 'CallExpression' &&
          init.callee &&
          init.callee.name === 'useColors'
        ) {
          if (d.value.id.type === 'Identifier' && d.value.id.name === 'colors') {
            found = true;
          }
          if (d.value.id.type === 'ObjectPattern') {
            d.value.id.properties.forEach((p) => {
              if (p.key && p.key.name === 'colors') found = true;
            });
          }
        }
      });
    return found;
  }

  function ensureColorsHook(funcPath) {
    if (hasColorsVar(funcPath)) return;
    ensureThemeImport('useColors');
    funcPath.node.body.body.unshift(
      j.variableDeclaration('const', [
        j.variableDeclarator(
          j.identifier('colors'),
          j.callExpression(j.identifier('useColors'), [])
        ),
      ])
    );
  }

  function ensureWithOpacity() {
    ensureThemeImport('withOpacity');
  }

  function addTodo(prop) {
    const comments = [
      j.commentLine(' TODO(theme): map to token'),
      j.commentLine(' eslint-disable-next-line local/no-hardcoded-colors'),
    ];
    prop.comments = (prop.comments || []).concat(comments);
    transformed = true;
  }

  function findFunction(path) {
    return (
      path.closest(j.FunctionDeclaration) ||
      path.closest(j.FunctionExpression) ||
      path.closest(j.ArrowFunctionExpression)
    );
  }

  function isPascal(name) {
    return /^[A-Z]/.test(name || '');
  }

  function safeForHook(funcPath) {
    if (!funcPath) return false;
    const node = funcPath.node;
    if (node.type === 'FunctionDeclaration') {
      return node.id && isPascal(node.id.name);
    }
    if (
      (node.type === 'FunctionExpression' ||
        node.type === 'ArrowFunctionExpression') &&
      funcPath.parent &&
      funcPath.parent.node.type === 'VariableDeclarator'
    ) {
      return isPascal(funcPath.parent.node.id.name);
    }
    return false;
  }

  let transformed = false;

  const rgbaRegex =
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d*(?:\.\d+)?))?\s*\)$/;

  root.find(j.ObjectExpression).forEach((objPath) => {
    objPath.value.properties.forEach((prop) => {
      if (prop.type !== 'Property') return;
      const keyName = prop.key.name || prop.key.value;
      if (!['color', 'backgroundColor', 'borderColor', 'shadowColor'].includes(keyName))
        return;
      if (prop.value.type !== 'Literal' || typeof prop.value.value !== 'string')
        return;

      const val = prop.value.value.toLowerCase();
      let tokenPath = null;
      let alpha = null;

      if (['#000', 'black'].includes(val)) {
        if (keyName === 'color') tokenPath = 'colors.text.primary';
        else if (['borderColor', 'shadowColor'].includes(keyName))
          tokenPath = 'colors.border.light';
      } else if (['#fff', 'white'].includes(val)) {
        if (keyName === 'color') tokenPath = 'colors.text.inverse';
        else tokenPath = 'colors.background.primary';
      } else {
        const match = rgbaRegex.exec(val);
        if (match) {
          const [_, r, g, b, a] = match;
          const alphaVal = a !== undefined ? parseFloat(a) : 1;
          if (r === '0' && g === '0' && b === '0') {
            if (keyName === 'color') tokenPath = 'colors.text.primary';
            else tokenPath = 'colors.background.primary';
          } else if (r === '255' && g === '255' && b === '255') {
            if (keyName === 'color') tokenPath = 'colors.text.inverse';
            else tokenPath = 'colors.background.primary';
          }
          if (tokenPath && alphaVal !== 1) alpha = alphaVal;
        }
      }

      if (tokenPath) {
        const funcPath = findFunction(objPath);
        if (safeForHook(funcPath)) {
          ensureColorsHook(funcPath);
          if (alpha !== null) {
            ensureWithOpacity();
            prop.value = callWithOpacity(j, tokenPath, alpha);
          } else {
            prop.value = memberFromPath(j, tokenPath);
          }
          transformed = true;
        } else {
          addTodo(prop);
        }
      } else {
        addTodo(prop);
      }
    });
  });

  return transformed ? root.toSource() : null;
};

