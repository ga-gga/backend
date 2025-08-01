const PopulationMapper = require('./PopulationMapper');
const WeatherMapper = require('./WeatherMapper');

class EnvironmentDataMapper {
  constructor() {
    this.populationMapper = new PopulationMapper();
    this.weatherMapper = new WeatherMapper();
  }

  transformApiResponse(apiParameterId, apiResponse) {
    if (!apiResponse || !apiResponse.data || !apiResponse.data.CITYDATA) {
      throw new Error('Invalid API response structure - cityData is required');
    }

    const cityData = apiResponse.data.CITYDATA;
    const collectedAt = new Date();
    const missingFields = [];

    const environmentData = {
      apiParameterId,
      dataCollectedAt: collectedAt,
      dataStatus: {
        isComplete: true,
        lastUpdated: collectedAt,
        errors: [],
      },
      population: null,
      populationForecast: null,
      weather: null,
      weatherForecast: null,
    };

    if (
      !cityData.LIVE_PPLTN_STTS ||
      !Array.isArray(cityData.LIVE_PPLTN_STTS) ||
      cityData.LIVE_PPLTN_STTS.length === 0
    ) {
      missingFields.push('LIVE_PPLTN_STTS');
    } else {
      try {
        const populationData = cityData.LIVE_PPLTN_STTS[0];
        environmentData.population = this.populationMapper.transformPopulationData(populationData);

        if (!populationData.FCST_PPLTN || !Array.isArray(populationData.FCST_PPLTN)) {
          missingFields.push('FCST_PPLTN');
        } else {
          environmentData.populationForecast = this.populationMapper.transformPopulationForecastData(
            populationData.FCST_PPLTN,
          );
        }
      } catch (error) {
        environmentData.dataStatus.errors.push({
          field: 'population',
          message: error.message,
          timestamp: new Date(),
        });
      }
    }

    if (!cityData.WEATHER_STTS || !Array.isArray(cityData.WEATHER_STTS) || cityData.WEATHER_STTS.length === 0) {
      missingFields.push('WEATHER_STTS');
    } else {
      try {
        const weatherData = cityData.WEATHER_STTS[0];
        environmentData.weather = this.weatherMapper.transformWeatherData(weatherData);

        if (!weatherData.FCST24HOURS || !Array.isArray(weatherData.FCST24HOURS)) {
          missingFields.push('FCST24HOURS');
        } else {
          environmentData.weatherForecast = this.weatherMapper.transformWeatherForecastData(weatherData.FCST24HOURS);
        }
      } catch (error) {
        environmentData.dataStatus.errors.push({
          field: 'weather',
          message: error.message,
          timestamp: new Date(),
        });
      }
    }

    if (missingFields.length > 0) {
      environmentData.dataStatus.isComplete = false;
      environmentData.dataStatus.missingFields = missingFields;
    }

    return environmentData;
  }
}

module.exports = EnvironmentDataMapper;
