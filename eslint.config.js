// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// ✅ Import required plugins and parser
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },

  // 🟦 TypeScript files only (.ts, .tsx)
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'], // Ensure tsconfig.json exists
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'enum',
          format: ['UPPER_CASE'],
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        {
          selector: ['class', 'interface', 'typeAlias'],
          format: ['PascalCase'],
        },
        {
          selector: 'variableLike',
          format: ['camelCase', 'UPPER_CASE'],
        },
      ],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off',
      'no-undef': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      'no-unreachable': 'error',
      'no-extra-semi': 'error',
      eqeqeq: ['error', 'always'],

      // ✅ Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // 🟨 JavaScript files (.js, .jsx)
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      sourceType: 'module',
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
]);
