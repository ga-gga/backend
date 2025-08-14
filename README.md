# ga-gga backend server

### Directory Structure

```text
ga-gga-server/
├── README.md
├── package.json
├── package-lock.json
├── appspec.yml
├── eslint.config.js
├── .prettierrc.js
├── server.js
├── .gitignore
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
│   │   ├── EnvironmentAggregationRepository.js
│   │   ├── EnvironmentRepository.js
│   │   └── KoreanAddressRepository.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── apiMetadataRoutes.js
│   │   ├── contentsRoutes.js
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
│   │   ├── ContentsService.js
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

### Data Collection Scheduler

- **실행 주기**: 매 10분마다 (`*/10 * * * *`)
- **수집 데이터**: 서울시 실시간 도시 환경 데이터
- **API**: seoul_real_time_city_data

---

### 문제 자가 진단

#### NoSQL을 RDB처럼 사용

```
Environment (환경데이터)
    ↓ (참조)
ApiParameter (장소정보)
    ↓ (참조)
KoreanAddress (주소정보)
```

```
// 지역별 조인 시
1. Environment 컬렉션 전체 스캔
2. ApiParameter 조인 (N개)
3. KoreanAddress 조인 (N*M개)
4. 메모리에서 그룹핑/정렬
5. 복잡한 날씨 계산
```

- 집계 파이프라인의 말도안되는 가독성
- join 대신 `$lookup` 사용으로 인한 성능 저하
- 복잡한 집계로 인한 샤딩 어려움
- $O(N*M)$ 복잡도

#### 개선 방향

1.  현재 구조를 계속 사용(또는 약간의 개선)할 것이라면 PostgreSQL 같은 RDB로 전환
2.  NoSQL의 장점을 살린다면 임베딩 구조로 재설계
