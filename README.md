# ga-gga backend server

### Directory Structure

```text
ga-gga-server/
├── README.md
├── package.json
├── package-lock.json
├── eslint.config.js
├── server.js
├── LICENSE
│
├── src/
│   ├── app.js
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── constants/
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
│   ├── models/
│   │   ├── apiMetadata.js
│   │   ├── apiParameter.js
│   │   ├── environment.js
│   │   ├── koreanAddress.js
│   │   └── sub/
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
│   │   ├── adminRoutes.js
│   │   ├── apiMetadataRoutes.js
│   │   ├── koreanAddressRoutes.js
│   │   └── mainRoutes.js
│   │
│   ├── scheduler/
│   │   └── DataScheduler.js
│   │
│   ├── services/
│   │   ├── ApiMetadataService.js
│   │   ├── ApiParameterService.js
│   │   ├── EnvironmentService.js
│   │   └── KoreanAddressService.js
│   │
│   └── utils/
│       ├── clients/
│       │   └── EnvironmentDataClient.js
│       ├── helpers/
│       │   ├── enumMapper.js
│       │   ├── parsers.js
│       │   └── validators.js
│       ├── loaders/
│       │   ├── ApiParameterLoader.js
│       │   ├── KoreanAddressLoader.js
│       │   └── appInitializer.js
│       └── mappers/
│           ├── EnvironmentDataMapper.js
│           ├── PopulationMapper.js
│           └── WeatherMapper.js
│
├── data/
│   ├── seoul_address_data.json
│   └── seoul_real_time_city_data_parameter.json
│
└── test/

```

---

### API

#### Base URL

- local:prod - http://localhost:3000

#### Public APIs

##### Region

- GET - /regions/hierarchy
  - 목적: 행정구역 계층별 그룹 조회

##### Main

- GET - /main
  - 목적: 메인페이지 데이터 조회

##### API Metadata

- GET - /api-metadata
  - 목적: API 메타데이터 목록 조회

#### Admin

##### Environment Data

- POST - /admin/environment-data
  - 목적: 환경 데이터 생성

##### API Metadata Management

- POST - /admin/api-metadata
  - 목적: API 메타데이터 생성

##### Content Filter Management

- POST - /admin/content-filters
  - 목적: 콘텐츠 필터 생성
- PUT - /admin/content-filters/:id
  - 목적: 콘텐츠 필터 수정

#### Error Handling

- 현재 사용중인 에러 상태 코드
  - **200**: 성공적인 응답
  - **404**: 리소스를 찾을 수 없음
  - **500**: 서버 내부 오류

### Scheduling Information

#### Data Collection Scheduler

- **실행 주기**: 매 10분마다 (`*/10 * * * *`)
- **수집 데이터**: 서울시 실시간 도시 환경 데이터
- **API**: seoul_real_time_city_data
