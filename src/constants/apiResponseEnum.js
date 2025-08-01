const { CONGESTION_LEVELS, PRECIPITATION_TYPES, SKY_TYPES } = require('./environmentEnum');

const CONGESTION = {
  '붐빔': CONGESTION_LEVELS.CROWDED,
  '약간 붐빔': CONGESTION_LEVELS.SLIGHTLY_CROWDED,
  '보통': CONGESTION_LEVELS.NORMAL,
  '여유': CONGESTION_LEVELS.RELAXED,
};

const PRECIPITATION = {
  '없음': PRECIPITATION_TYPES.NONE,
  '비': PRECIPITATION_TYPES.RAIN,
  '눈': PRECIPITATION_TYPES.SNOW,
  '빗방울': PRECIPITATION_TYPES.DRIZZLE,
  '소나기': PRECIPITATION_TYPES.SHOWER,
  '-': PRECIPITATION_TYPES.NONE,
};

const SKY = {
  '맑음': SKY_TYPES.CLEAR,
  '구름많음': SKY_TYPES.MOSTLY_CLOUD,
  '흐림': SKY_TYPES.CLOUD,
  '비': SKY_TYPES.RAIN,
  '눈': SKY_TYPES.SNOW,
  '바람': SKY_TYPES.WIND,
};

const LEVEL = {
  '매우 낮음': 'VERY_LOW',
  '낮음': 'LOW',
  '보통': 'NORMAL',
  '높음': 'HIGH',
  '매우 높음': 'VERY_HIGH',
  '위험': 'DANGEROUS',
};

const QUALITY = {
  '좋음': 'GOOD',
  '보통': 'NORMAL',
  '나쁨': 'BAD',
  '매우 나쁨': 'VERY_BAD',
  '점검중': 'UNDER_INSPECTION',
};

module.exports = {
  CONGESTION,
  PRECIPITATION,
  SKY,
  LEVEL,
  QUALITY,
};
