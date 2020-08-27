module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react-hooks', 'prettier'],
  extends: ['react-app', 'airbnb-typescript', 'plugin:prettier/recommended'],
  rules: {
    'object-curly-spacing': ['warn', 'always'],
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'none',
      },
    ],
    'no-debugger': 0, // 1
    'no-console': 0, // ['error', { allow: ['warn', 'error'] }],
    'no-undefined': 'error',
    'no-shadow': 0,
    'no-undefined': 0,
    'no-param-reassign': 0,
    'no-return-assign': 0,
    'class-methods-use-this': 0,
    'no-constant-condition': ['error'],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'import/prefer-default-export': 0,
    'import/no-default-export': 1,
    'import/extensions': 0,
    'react/destructuring-assignment': 0,
    'react/prop-types': 0,
    'react/jsx-curly-newline': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/static-property-placement': 0,
  },
};
