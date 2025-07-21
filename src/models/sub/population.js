const mongoose = require('mongoose');
const { CONGESTION_LEVELS } = require('../../constants/environmentEnums');

const populationSchema = new mongoose.Schema(
  {
    congestionLevel: {
      type: String,
      required: true,
      enum: Object.values(CONGESTION_LEVELS),
    },
    congestionMessage: {
      type: String,
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
    maleRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    femaleRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    ageDistribution: {
      rate0: { type: Number, min: 0, max: 100, default: 0 },
      rate10: { type: Number, min: 0, max: 100, default: 0 },
      rate20: { type: Number, min: 0, max: 100, default: 0 },
      rate30: { type: Number, min: 0, max: 100, default: 0 },
      rate40: { type: Number, min: 0, max: 100, default: 0 },
      rate50: { type: Number, min: 0, max: 100, default: 0 },
      rate60: { type: Number, min: 0, max: 100, default: 0 },
      rate70: { type: Number, min: 0, max: 100, default: 0 },
    },
    residentRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    nonResidentRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { _id: false },
);

module.exports = populationSchema;
