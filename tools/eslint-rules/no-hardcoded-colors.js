const colorProps = new Set(['color', 'backgroundColor', 'borderColor', 'shadowColor']);
const colorRegex = /^(#(?:[0-9a-fA-F]{3,8})|(?:rgb|hsl)a?\(.*\)|[a-zA-Z]+)$/;

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow hard-coded colors',
    },
    fixable: 'code',
  },
  create(context) {
    let hasUseColorsImport = false;
    return {
      Program(node) {
        hasUseColorsImport = node.body.some(
          (n) =>
            n.type === 'ImportDeclaration' &&
            n.specifiers.some(
              (s) => s.type === 'ImportSpecifier' && s.imported.name === 'useColors'
            )
        );
      },
      JSXAttribute(node) {
        if (node.name.name !== 'style') return;
        if (node.value && node.value.type === 'JSXExpressionContainer') {
          const expr = node.value.expression;
          const objs = [];
          if (expr.type === 'ObjectExpression') objs.push(expr);
          if (expr.type === 'ArrayExpression') {
            expr.elements.forEach((el) => {
              if (el && el.type === 'ObjectExpression') objs.push(el);
            });
          }
          objs.forEach((obj) => checkObject(obj, context, hasUseColorsImport));
        }
      },
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'StyleSheet' &&
          node.callee.property.name === 'create'
        ) {
          const arg = node.arguments[0];
          if (arg && arg.type === 'ObjectExpression') {
            arg.properties.forEach((prop) => {
              if (prop.type === 'Property' && prop.value.type === 'ObjectExpression') {
                checkObject(prop.value, context, hasUseColorsImport);
              }
            });
          }
        }
      },
    };
  },
};

function checkObject(obj, context, hasUseColorsImport) {
  obj.properties.forEach((prop) => {
    if (prop.type !== 'Property') return;
    const keyName = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
    if (!colorProps.has(keyName)) return;
    const val = prop.value;
    if (val.type !== 'Literal' || typeof val.value !== 'string') return;
    if (!colorRegex.test(val.value)) return;

    const isText = keyName === 'color';
    const replaceMap = {
      '#000': isText ? 'colors.text.primary' : 'colors.background.primary',
      black: isText ? 'colors.text.primary' : 'colors.background.primary',
      '#fff': isText ? 'colors.text.inverse' : 'colors.background.primary',
      white: isText ? 'colors.text.inverse' : 'colors.background.primary',
    };
    const replacement = replaceMap[val.value.toLowerCase()];
    context.report({
      node: val,
      message:
        'Use ThemeProvider tokens (useColors/useTokens/withOpacity) instead of hard-coded colors.',
      fix: replacement && hasUseColorsImport
        ? (fixer) => fixer.replaceText(val, replacement)
        : undefined,
    });
  });
}
