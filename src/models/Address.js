const mongoose = require('mongoose');

const dongSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const guSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    dongs: [dongSchema],
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    gus: [guSchema],
  },
  { timestamps: true },
);

addressSchema.index({ code: 1 });
addressSchema.index({ 'gus.code': 1 });
addressSchema.index({ 'gus.dongs.code': 1 });

module.exports = mongoose.model('Address', addressSchema);
