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
│   │   └── environmentEnum.js
│   │
│   ├── errors/
│   │   ├── DataError.js
│   │   ├── DatabaseError.js
│   │   └── NotFoundError.js
│   │
│   ├── models/
│   │   ├── ApiMetadata.js
│   │   ├── ApiParameter.js
│   │   ├── KoreanAddress.js
│   │   ├── contentFilter.js
│   │   ├── environment.js
│   │   └── sub/
│   │       ├── filterCondition.js
│   │       ├── population.js
│   │       ├── populationForecast.js
│   │       ├── weather.js
│   │       └── weatherForecast.js
│   │
│   ├── repositories/
│   │   ├── ApiMetadataRepository.js
│   │   ├── ApiParameterRepository.js
│   │   ├── ContentFilterRepository.js
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
│   │   ├── ContentFilterService.js
│   │   ├── EnvironmentService.js
│   │   ├── KoreanAddressService.js
│   │   └── MainService.js
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
│       ├── mappers/
│       │   ├── EnvironmentDataMapper.js
│       │   ├── PopulationMapper.js
│       │   └── WeatherMapper.js
│       └── services/
│           └── EnvironmentDataGeneratorService.js
│
├── data/
│   ├── seoul_address_data.json
│   └── seoul_real_time_city_data_parameter.json
│
└── test/

```

---

### API

#### Region

- GET - /regions/hierarchy
  - 목적: 행정구역 계층별 그룹 조회

</br>

#### Main

- GET - /main
  - 목적: 메인페이지 데이터 조회

</br>

#### Admin

###### API Metadata

- GET - /api-metadata
  - 목적: API 메타데이터 목록 조회

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

</br>

### Scheduling Information

#### Data Collection Scheduler

- **실행 주기**: 매 10분마다 (`*/10 * * * *`)
- **수집 데이터**: 서울시 실시간 도시 환경 데이터
- **API**: seoul_real_time_city_data
