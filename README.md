# ga-gga backend server

### Directory Structure

```text
ga-gga-server/
├── README.md
├── package.json
├── package-lock.json
├── eslint.config.js
├── server.js                 # 애플리케이션 엔트리 포인트
│
├── src/
│   ├── app.js               # Express 앱 설정 및 라우팅
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── KoreanAddressController.js
│   │
│   ├── middleware/
│   │   └── errorMiddleware.js
│   │
│   ├── models/              # Mongoose 스키마 정의
│   │   └── KoreanAddress.js
│   │
│   ├── repositories/
│   │   └── KoreanAddressRepository.js
│   │
│   ├── routes/
│   │   └── koreanAddressRoutes.js
│   │
│   ├── services/
│   │   └── KoreanAddressService.js
│   │
│   └── utils/
│       ├── appInitializer.js      # 앱 초기화 로직
│       └── KoreanAddressLoader.js # 정적 데이터 로더
│
└── data/
    └── seoul_address_data.json    # 서울 주소 정적 데이터

```

---

### API

#### Base URL

- local:prod - http://localhost:3000

#### Utility

- GET - /
  - 응답: API 정보 및 사용 가능한 엔드포인트 목록
- GET - /regions/check
  - 응답: {"initialized": true/false}

#### Region

- GET - /regions/levels
  - 목적: 행정구역 레벨별 그룹 조회
  - 응답 구조
    ```
    {
      "SIDO": [...],
      "SIGUNGU": [...],
      "EUPMYEONDONG": [...],
      "RI": [...]
    }
    ```

#### Error Handling

- GET - `/non-existent`

  - **목적**: 존재하지 않는 엔드포인트 테스트
  - **응답**: `404 Not Found`
  - **에러 메시지**: `{"error": "Endpoint not found"}`

- 현재 사용중인 에러 상태 코드
  - **200**: 성공적인 응답
  - **404**: 리소스를 찾을 수 없음
  - **500**: 서버 내부 오류
