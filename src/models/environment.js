const mongoose = require('mongoose');
const populationSchema = require('./sub/population');
const populationForecastSchema = require('./sub/populationForecast');
const weatherSchema = require('./sub/weather');
const weatherForecastSchema = require('./sub/weatherForecast');

const environmentSchema = new mongoose.Schema(
  {
    apiParameterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApiParameter',
      required: true,
    },
    dataCollectedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    dataStatus: {
      isComplete: {
        type: Boolean,
        default: false,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
      errors: [
        {
          field: String,
          message: String,
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    population: populationSchema,
    populationForecast: [populationForecastSchema],
    weather: weatherSchema,
    weatherForecast: [weatherForecastSchema],
  },
  {
    timestamps: true,
  },
);

environmentSchema.index(
  { apiParameterId: 1, dataCollectedAt: 1 },
  {
    unique: true,
    partialFilterExpression: { 'dataStatus.isComplete': true },
  },
);

module.exports = mongoose.model('Environment', environmentSchema);
