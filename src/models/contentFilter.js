const mongoose = require('mongoose');
const filterConditionSchema = require('./sub/filterCondition');

const contentFilterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: ['BANNER', 'CATEGORY'],
    },
    imageUrl: {
      type: String,
      default: 'https://...',
    },
    icon: {
      type: String,
      required: function () {
        return this.type === 'BANNER';
      },
    },
    filterCondition: filterConditionSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('ContentFilter', contentFilterSchema);
