const mongoose = require('mongoose');

const apiParameterSchema = new mongoose.Schema(
  {
    externalCode: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    koreanAddressCode: {
      type: String,
      ref: 'KoreanAddress',
      match: /^\d{10}$/,
    },
    apiMetadataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApiMetadata',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

apiParameterSchema.index({ apiMetadataId: 1, externalCode: 1, koreanAddressCode: 1 }, { unique: true });

module.exports = mongoose.model('ApiParameter', apiParameterSchema);
