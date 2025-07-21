const mongoose = require('mongoose');
const populate = require('./sub/populate');
const populationForecast = require('./sub/populationForecast');
const weather = require('./sub/weather');
const weatherForecast = require('./sub/weatherForecast');

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
    populate: populate,
    populationForecast: [populationForecast],
    weather: weather,
    weatherForecast: [weatherForecast],
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
