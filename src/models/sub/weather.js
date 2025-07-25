const mongoose = require('mongoose');
const { PRECIPITATION_TYPES } = require('../../constants/environmentEnums');

const weatherSchema = new mongoose.Schema(
  {
    weatherTimestamp: {
      type: Date,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    sensibleTemperature: {
      type: Number,
    },
    maxTemperature: {
      type: Number,
    },
    minTemperature: {
      type: Number,
    },
    humidity: {
      type: Number,
      required: true,
    },
    windDirection: {
      type: String,
      required: true,
    },
    windSpeed: {
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
    uvLevel: {
      type: String,
      required: true,
    },
    uvType: {
      type: String,
      required: true,
    },
    pm2p5Level: {
      type: String,
      required: true,
    },
    pm2p5Type: {
      type: String,
      required: true,
    },
    pm10Level: {
      type: String,
      required: true,
    },
    pm10Type: {
      type: String,
      required: true,
    },
    airQualityType: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

module.exports = weatherSchema;
