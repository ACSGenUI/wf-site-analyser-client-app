import path from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

// Resolve __dirname in ESM context so FlatCompat can find legacy configs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'out/**',
      'dist/**',
      '*.config.{ts,js,mjs,cjs}',
      'src/renderer/styles/tokens.js',
      'src/renderer/__tests__/auth/**',
      'src/renderer/__tests__/components/**',
      'src/renderer/__tests__/features/**',
      'src/renderer/__tests__/lifecycle/**',
      'src/renderer/__tests__/templates/**',
    ],
  },

  // Base JS rules
  js.configs.recommended,

  ...compat.extends('airbnb', 'airbnb/hooks'),

  // TypeScript + React source files
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // React 19 — no need to import React in scope
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Enforce no any (SA-106 will tighten further)
      '@typescript-eslint/no-explicit-any': 'error',
      // TypeScript handles undefined checking
      'no-undef': 'off',
      'react/jsx-filename-extension': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'react/require-default-props': 'off',
      'linebreak-style': 'off',
      'import/prefer-default-export': 'off',
      'react/jsx-props-no-spreading': 'off',
      'function-paren-newline': 'off',
      'implicit-arrow-linebreak': 'off',
      'no-confusing-arrow': 'off',
      'object-curly-newline': 'off',
      'operator-linebreak': 'off',
      // Structured import ordering with blank-line separators (SA-106)
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            { pattern: '@/**', group: 'internal' },
            { pattern: '@main/**', group: 'internal' },
            { pattern: '@shared/**', group: 'internal' },
            { pattern: '@preload/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Scaffold test files: components/hooks they reference don't exist yet
  {
    files: ['src/renderer/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-promise-executor-return': 'off',
      'no-restricted-syntax': 'off',
      'no-await-in-loop': 'off',
    },
  },
];
