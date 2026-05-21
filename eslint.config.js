const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
  // Global ignores
  {
    ignores: ['node_modules/**', 'out/**', 'dist/**', '*.config.ts', '*.config.js'],
  },

  // Base JS rules
  js.configs.recommended,

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
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];
