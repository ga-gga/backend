const mongoose = require('mongoose');
const { CONGESTION_LEVELS, SKY_TYPES } = require('../../constants/environmentEnum');

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
      min: { type: Number, default: 0 },
      max: { type: Number, default: 100 },
    },
  },
  {
    _id: false,
  },
);

module.exports = filterConditionSchema;
