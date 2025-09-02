import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import localPlugin from '../../tools/eslint-rules/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [
      'node_modules',
      'build',
      'dist',
      'web-build',
      'polyfills/**',
      '__create/**',
      'metro.config.js',
      'index.web.tsx',
      'webpack.config.js',
      'src/utils/textScaling.ts',
    ],
  },
  ...compat.extends('universe/native', 'universe/shared/typescript-analysis'),
  {
    plugins: {
      '@typescript-eslint': tsPlugin,
      local: localPlugin,
    },
    languageOptions: {
      globals: {
        URLSearchParams: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'local/no-hardcoded-colors': 'error',
    },
  },
  {
    files: ['**/__tests__/**'],
    rules: {
      'local/no-hardcoded-colors': 'warn',
    },
  },
];
