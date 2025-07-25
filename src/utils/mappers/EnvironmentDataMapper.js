const PopulationMapper = require('./PopulationMapper');
const WeatherMapper = require('./WeatherMapper');

class EnvironmentDataMapper {
  constructor() {
    this.populationMapper = new PopulationMapper();
    this.weatherMapper = new WeatherMapper();
  }

  transformApiResponse(apiParameterId, apiResponse) {
    if (!apiResponse || !apiResponse.data || !apiResponse.data.CITYDATA) {
      throw new Error('Invalid API response structure');
    }

    const cityData = apiResponse.data.CITYDATA;
    const collectedAt = new Date();

    const environmentData = {
      apiParameterId,
      dataCollectedAt: collectedAt,
      dataStatus: {
        isComplete: false,
        lastUpdated: collectedAt,
        errors: [],
      },
    };

    try {
      if (
        !cityData.LIVE_PPLTN_STTS ||
        !Array.isArray(cityData.LIVE_PPLTN_STTS) ||
        cityData.LIVE_PPLTN_STTS.length === 0
      ) {
        throw new Error('Missing population data');
      }

      if (!cityData.WEATHER_STTS || !Array.isArray(cityData.WEATHER_STTS) || cityData.WEATHER_STTS.length === 0) {
        throw new Error('Missing weather data');
      }

      const populationData = cityData.LIVE_PPLTN_STTS[0];
      if (!populationData.FCST_PPLTN || !Array.isArray(populationData.FCST_PPLTN)) {
        throw new Error('Missing population forecast data');
      }

      const weatherData = cityData.WEATHER_STTS[0];
      if (!weatherData.FCST24HOURS || !Array.isArray(weatherData.FCST24HOURS)) {
        throw new Error('Missing weather forecast data');
      }

      environmentData.population = this.populationMapper.transformPopulationData(cityData.LIVE_PPLTN_STTS[0]);
      environmentData.populationForecast = this.populationMapper.transformPopulationForecastData(
        cityData.LIVE_PPLTN_STTS[0].FCST_PPLTN,
      );
      environmentData.weather = this.weatherMapper.transformWeatherData(cityData.WEATHER_STTS[0]);
      environmentData.weatherForecast = this.weatherMapper.transformWeatherForecastData(
        cityData.WEATHER_STTS[0].FCST24HOURS,
      );
      environmentData.dataStatus.isComplete = true;
    } catch (error) {
      console.log(error);
      environmentData.dataStatus.errors.push({
        field: 'transformation',
        message: error.message,
        timestamp: new Date(),
      });
    }

    return environmentData;
  }
}

module.exports = EnvironmentDataMapper;
