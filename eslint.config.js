const js = require('@eslint/js');
const nodePlugin = require('eslint-plugin-n');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  { ignores: ['dist/**/*', 'node_modules/**/*'] },

  js.configs.recommended,

  prettierConfig,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        module: 'writable',
        require: 'readonly',
      },
    },
    plugins: {
      n: nodePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',

      'no-var': 'error',
      'prefer-const': 'error',
      /* 'no-console': 'warn', */
      eqeqeq: ['error', 'always'],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^(req|res|next|_)$',
        },
      ],

      'n/no-unpublished-require': 'off',
      'n/no-missing-import': 'off',
      'n/handle-callback-err': 'error',
      'n/no-deprecated-api': 'error',

      'no-async-promise-executor': 'error',
      'require-await': 'warn',

      'no-throw-literal': 'error',
    },
  },
];
