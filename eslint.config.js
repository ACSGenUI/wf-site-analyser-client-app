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
    ignores: ['node_modules/**', 'out/**', 'dist/**', '*.config.ts', '*.config.js'],
  },

  // Base JS rules
  js.configs.recommended,

  // Airbnb style guide (SA-106 — added via reviewer feedback).
  // Note: airbnb-typescript intentionally omitted — its v18 references
  // @typescript-eslint rules removed in v8 (e.g. brace-style, now handled
  // by Prettier), which causes a runtime ESLint crash.
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
];
