const js = require('@eslint/js');
const nodePlugin = require('eslint-plugin-node');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // ESLint 기본 권장 규칙
  js.configs.recommended,

  // 메인 설정
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022, // 최신 JavaScript 문법 지원
      sourceType: 'commonjs', // require/module.exports 방식
      globals: {
        // Node.js 전역 변수들
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
      node: nodePlugin, // Node.js 관련 규칙
      prettier: prettierPlugin, // Prettier 연동
    },
    rules: {
      // Prettier 관련
      'prettier/prettier': 'error', // Prettier 규칙 위반시 에러

      // 개발 관련
      'no-console': 'warn', // console.log 사용시 경고
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^(req|res|next)$', // Express 핸들러 매개변수 허용
        },
      ],

      // JavaScript 기본
      'no-var': 'error', // var 사용 금지
      'prefer-const': 'error', // 재할당 없으면 const 사용
      'no-undef': 'error', // 정의되지 않은 변수 사용 금지

      // Express API 관련
      eqeqeq: ['error', 'always'], // === 연산자 사용 강제
      'no-throw-literal': 'error', // Error 객체만 throw 허용

      // Node.js 관련
      'node/no-unpublished-require': 'off', // devDependencies require 허용
      'node/no-missing-import': 'off', // require 경로 해석 오류 방지
      'handle-callback-err': 'error', // 콜백 에러 처리 강제

      // 비동기 처리
      'no-async-promise-executor': 'error', // Promise 생성자에서 async 함수 사용 금지
      'require-await': 'warn', // async 함수에 await 없으면 경고
    },
  },

  // Prettier 설정 (포맷팅 규칙 충돌 방지)
  prettierConfig,
];
