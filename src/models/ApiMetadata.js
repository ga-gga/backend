const mongoose = require('mongoose');

const apiMetadataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    updateInterval: {
      type: Number,
      required: true,
      min: 60, // 최소 1분
    },
    lastSyncAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('ApiMetadata', apiMetadataSchema);
