const { CONGESTION } = require('../../constants/apiResponseEnum');
const { createEnumMapper } = require('../helpers/enumMapper');
const { safeParseInt, safeParseFloat, transformDateString } = require('../helpers/parsers');

class PopulationMapper {
  constructor() {
    this.mappingCongestionLevel = createEnumMapper(CONGESTION, 'CongestionLevel');
  }

  transformPopulationData(populationData) {
    return {
      congestionLevel: this.mappingCongestionLevel(populationData.AREA_CONGEST_LVL),
      congestionMessage: populationData.AREA_CONGEST_MSG || '',
      populationMin: safeParseInt(populationData.AREA_PPLTN_MIN),
      populationMax: safeParseInt(populationData.AREA_PPLTN_MAX),
      maleRate: safeParseFloat(populationData.MALE_PPLTN_RATE),
      femaleRate: safeParseFloat(populationData.FEMALE_PPLTN_RATE),
      ageDistribution: this.transformAgeDistribution(populationData),
      residentRate: safeParseFloat(populationData.RESNT_PPLTN_RATE),
      nonResidentRate: safeParseFloat(populationData.NON_RESNT_PPLTN_RATE),
    };
  }

  transformAgeDistribution(populationData) {
    const ageDistribution = {
      rate0: safeParseFloat(populationData.PPLTN_RATE_0),
      rate10: safeParseFloat(populationData.PPLTN_RATE_10),
      rate20: safeParseFloat(populationData.PPLTN_RATE_20),
      rate30: safeParseFloat(populationData.PPLTN_RATE_30),
      rate40: safeParseFloat(populationData.PPLTN_RATE_40),
      rate50: safeParseFloat(populationData.PPLTN_RATE_50),
      rate60: safeParseFloat(populationData.PPLTN_RATE_60),
      rate70: safeParseFloat(populationData.PPLTN_RATE_70),
    };

    return ageDistribution;
  }

  transformPopulationForecastData(forecastArray) {
    if (!Array.isArray(forecastArray)) {
      console.warn('parameter is not an array');
      return [];
    }

    return forecastArray.map((forecast) => ({
      forecastTime: transformDateString(forecast.FCST_TIME),
      congestionLevel: this.mappingCongestionLevel(forecast.FCST_CONGEST_LVL),
      populationMin: safeParseInt(forecast.FCST_PPLTN_MIN),
      populationMax: safeParseInt(forecast.FCST_PPLTN_MAX),
    }));
  }
}

module.exports = PopulationMapper;
