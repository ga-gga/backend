const mongoose = require('mongoose');

const koreanAddressSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      match: /^\d{10}$/,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      enum: ['SIDO', 'SIGUNGU', 'EUPMYEONDONG', 'RI'],
    },
    parentCode: {
      type: String,
      default: null,
      validate: {
        validator: function (value) {
          return value === null || value === undefined || /^\d{10}$/.test(value);
        },
      },
    },
    thumbnailUrl: {
      type: String,
      default: 'https://..',
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

koreanAddressSchema.index({ level: 1, name: 1 });

module.exports = mongoose.model('KoreanAddress', koreanAddressSchema);
