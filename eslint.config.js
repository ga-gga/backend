const js = require('@eslint/js');
const nodePlugin = require('eslint-plugin-n');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // 파일 제외 설정
  {
    ignores: ['dist/**/*', 'node_modules/**/*'],
  },

  // ESLint 기본 권장 규칙
  js.configs.recommended,

  // 메인 설정
  {
    files: ['**/*.js'], // 모든 하위 디렉토리 JS 파일 대상
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'commonjs',
      globals: {
        /**
         * Node.js 환경 전역 변수
         *
         * process: 프로세스 전역 객체
         * Buffer: 바이너리 데이터 처리 클래스
         * global: 전역 네임스페이스 객체
         * console: 콘솔 출력 객체
         * _dirname: 현재 모듈의 디렉토리 절대경로 변수/문자열
         * _filename: 현재 모듈의 파일 절대경로 변수/문자열
         * exports: 모듈 내보내기 객체
         * module: 현재 모듈 객체
         * require: 모듈 가져오기 함수
         */
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
      n: nodePlugin, // Node.js 관련 규칙
      prettier: prettierPlugin, // Prettier 연동
    },
    rules: {
      // Prettier 관련
      'prettier/prettier': 'error', // Prettier 규칙 위반시 에러

      // 기본 JavaScript 규칙
      'no-var': 'error', // var 사용 금지
      'prefer-const': 'error', // 재할당 없으면 const 사용
      'no-console': 'warn', // console.log 사용시 경고
      eqeqeq: ['error', 'always'], // 엄격한 동등 비교(===, !==) 연산자 사용 강제
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^(req|res|next|_)$', // Express 매개변수 + 언더스코어 허용
        },
      ],

      // Node.js 관련 규칙
      'n/no-unpublished-require': 'off', // devDependencies require 허용
      'n/no-missing-import': 'off', // 모듈 해석 오류 방지
      'n/handle-callback-err': 'error', // 콜백 에러 처리 강제
      'n/no-deprecated-api': 'error', // 폐기된 Node.js API 사용 금지

      // 비동기 처리
      'no-async-promise-executor': 'error', // Promise 생성자 내부에서 async 함수를 사용하는 것을 금지
      'require-await': 'warn', // async 함수 내부에 await가 없으면 경고를 표시

      // Express API 관련
      'no-throw-literal': 'error', // Error 객체만 throw 허용
    },
  },

  // Prettier 설정 (포맷팅 규칙 충돌 방지)
  prettierConfig,
];
