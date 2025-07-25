# ga-gga backend server

### Directory Structure

```text
ga-gga-server/
├── README.md
├── package.json
├── package-lock.json
├── eslint.config.js
├── server.js                    # 애플리케이션 엔트리 포인트
├── LICENSE
│
├── src/
│   ├── app.js                  # Express 앱 설정 및 라우팅
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── constants/              # 상수 정의
│   │   ├── apiResponseEnum.js
│   │   └── environmentEnums.js
│   │
│   ├── controllers/
│   │   ├── ApiMetadataController.js
│   │   └── KoreanAddressController.js
│   │
│   ├── middleware/
│   │   └── errorMiddleware.js
│   │
│   ├── models/                 # Mongoose 스키마 정의
│   │   ├── apiMetadata.js
│   │   ├── apiParameter.js
│   │   ├── environment.js
│   │   ├── koreanAddress.js
│   │   └── sub/                # 세부 모델
│   │       ├── population.js
│   │       ├── populationForecast.js
│   │       ├── weather.js
│   │       └── weatherForecast.js
│   │
│   ├── repositories/
│   │   ├── ApiMetadataRepository.js
│   │   ├── ApiParameterRepository.js
│   │   ├── EnvironmentRepository.js
│   │   └── KoreanAddressRepository.js
│   │
│   ├── routes/
│   │   ├── apiMetadataRoutes.js
│   │   └── koreanAddressRoutes.js
│   │
│   ├── scheduler/              # 스케줄링 관련
│   │   └── DataScheduler.js
│   │
│   ├── services/
│   │   ├── ApiMetadataService.js
│   │   ├── ApiParameterService.js
│   │   ├── EnvironmentService.js
│   │   └── KoreanAddressService.js
│   │
│   └── utils/
│       ├── clients/            # 외부 API 클라이언트
│       │   └── EnvironmentDataClient.js
│       ├── helpers/            # 유틸리티 함수
│       │   ├── enumMapper.js
│       │   ├── parsers.js
│       │   └── validators.js
│       ├── loaders/            # 데이터 로더
│       │   ├── ApiParameterLoader.js
│       │   ├── KoreanAddressLoader.js
│       │   └── appInitializer.js
│       └── mappers/            # 데이터 매핑
│           ├── EnvironmentDataMapper.js
│           ├── PopulationMapper.js
│           └── WeatherMapper.js
│
├── data/
│   ├── seoul_address_data.json                # 서울 주소 정적 데이터
│   └── seoul_real_time_city_data_parameter.json  # API 파라미터 설정
│
└── test/

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

### Scheduling Information

#### Data Collection Scheduler

- **실행 주기**: 매 10분마다 (`*/10 * * * *`)
- **수집 데이터**: 서울시 실시간 도시 환경 데이터
- **API**: seoul_real_time_city_data
