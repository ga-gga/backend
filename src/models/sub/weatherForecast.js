const mongoose = require('mongoose');
const { PRECIPITATION_TYPES, SKY_TYPES } = require('../../constants/environmentEnum');

const weatherForecastSchema = new mongoose.Schema(
  {
    forecastTime: {
      type: Date,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    precipitation: {
      type: String,
      required: true,
    },
    precipitationType: {
      type: String,
      required: true,
      enum: Object.values(PRECIPITATION_TYPES),
    },
    rainChance: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    skyStatus: {
      type: String,
      required: true,
      enum: Object.values(SKY_TYPES),
    },
  },
  { _id: false },
);

module.exports = weatherForecastSchema;
