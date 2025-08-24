module.exports = {
  root: true,
  extends: ['universe/native', 'universe/shared/typescript-analysis'],
  parserOptions: { ecmaVersion: 2023, sourceType: 'module', project: './tsconfig.json' },
  ignorePatterns: ['dist/', 'build/', 'web-build/', 'node_modules/'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
};