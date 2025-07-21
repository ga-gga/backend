const mongoose = require('mongoose');
const { CONGESTION_LEVELS } = require('../../constants/environmentEnums');

const populationForecastSchema = new mongoose.Schema(
  {
    forecastTime: {
      type: Date,
      required: true,
    },
    congestionLevel: {
      type: String,
      required: true,
      enum: Object.values(CONGESTION_LEVELS),
    },
    populationMin: {
      type: Number,
      required: true,
      min: 0,
    },
    populationMax: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

module.exports = populationForecastSchema;
