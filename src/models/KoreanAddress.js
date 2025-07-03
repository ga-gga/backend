const mongoose = require('mongoose');

const koreanAddressSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
  },
);

koreanAddressSchema.index({ level: 1, name: 1 }, { name: 'level_name_index' });

module.exports = mongoose.model('KoreanAddress', koreanAddressSchema);
