// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        // Enum names: UPPER_CASE
        {
          selector: 'enum',
          format: ['UPPER_CASE'],
        },
        // Enum members: UPPER_CASE
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
        // Constants: UPPER_CASE
        {
          selector: 'variable',
          modifiers: ['const'],
          format: [ 'camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        // Classes, interfaces, type aliases: PascalCase
        {
          selector: ['class', 'interface', 'typeAlias'],
          format: ['PascalCase'],
        },
        // Variables & properties: camelCase
        {
          selector: 'variableLike',
          format: ['camelCase', 'UPPER_CASE'],
        },
      ],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
    }
  }
]);
