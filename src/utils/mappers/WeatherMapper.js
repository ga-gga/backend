const { PRECIPITATION, SKY, LEVEL, QUALITY } = require('../../constants/apiResponseEnum');
const { createEnumMapper } = require('../helpers/enumMapper');
const { safeParseFloat, safeParseInt, transformDateString, transformTimestamp } = require('../helpers/parsers');

class WeatherMapper {
  constructor() {
    this.mappingPrecipitationType = createEnumMapper(PRECIPITATION, 'PrecipitationType');
    this.mappingSkyType = createEnumMapper(SKY, 'SkyType');
    this.mappingLevel = createEnumMapper(LEVEL, 'Level');
    this.mappingQuality = createEnumMapper(QUALITY, 'Quality');
  }

  transformWeatherData(weatherData) {
    return {
      weatherTimestamp: transformDateString(weatherData.WEATHER_TIME),
      temperature: safeParseFloat(weatherData.TEMP),
      sensibleTemperature: safeParseFloat(weatherData.SENSIBLE_TEMP, null),
      maxTemperature: safeParseFloat(weatherData.MAX_TEMP, null),
      minTemperature: safeParseFloat(weatherData.MIN_TEMP, null),
      humidity: safeParseInt(weatherData.HUMIDITY),
      windDirection: weatherData.WIND_DIRCT || '',
      windSpeed: safeParseFloat(weatherData.WIND_SPD),
      precipitation: weatherData.PRECIPITATION || '',
      precipitationType: this.mappingPrecipitationType(weatherData.PRECPT_TYPE),
      uvLevel: weatherData.UV_INDEX_LVL || '',
      uvType: this.mappingLevel(weatherData.UV_INDEX),
      pm2p5Level: weatherData.PM25 || '',
      pm2p5Type: this.mappingQuality(weatherData.PM25_INDEX),
      pm10Level: weatherData.PM10 || '',
      pm10Type: this.mappingQuality(weatherData.PM10_INDEX),
      airQualityType: this.mappingQuality(weatherData.AIR_IDX),
    };
  }

  transformWeatherForecastData(forecastArray) {
    if (!Array.isArray(forecastArray)) {
      console.warn('parameter is not an array');
      return [];
    }

    return forecastArray.map((forecast) => ({
      forecastTime: transformTimestamp(forecast.FCST_DT),
      temperature: safeParseFloat(forecast.TEMP),
      precipitation: forecast.PRECIPITATION,
      precipitationType: this.mappingPrecipitationType(forecast.PRECPT_TYPE),
      rainChance: safeParseInt(forecast.RAIN_CHANCE),
      skyStatus: this.mappingSkyType(forecast.SKY_STTS),
    }));
  }
}

module.exports = WeatherMapper;
