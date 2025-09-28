const globals = require('globals');
const pluginJs = require('@eslint/js');
const tseslint = require('typescript-eslint');
const pluginReact = require('eslint-plugin-react');
const eslintConfigPrettier = require('eslint-config-prettier');
const reactCompiler = require('eslint-plugin-react-compiler');

module.exports = [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  reactCompiler.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
    },
    ignores: ['dist/**', 'docs/**', 'node_modules/**', '*.d.ts']
  },
];
