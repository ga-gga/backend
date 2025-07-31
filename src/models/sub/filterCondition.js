const mongoose = require('mongoose');
const { CONGESTION_LEVELS, SKY_TYPES } = require('../../constants/environmentEnums');

const filterConditionSchema = new mongoose.Schema(
  {
    congestion: {
      type: [String],
      enum: Object.values(CONGESTION_LEVELS),
      default: [],
    },
    skyStatus: {
      type: [String],
      enum: Object.values(SKY_TYPES),
      default: [],
    },
    temperature: {
      min: { type: Number },
      max: { type: Number },
    },
  },
  {
    _id: false,
  },
);

module.exports = filterConditionSchema;
