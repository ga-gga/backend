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
    address: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    koreanAddressCodes: [
      {
        type: String,
        ref: 'KoreanAddress',
        required: true,
        match: /^\d{10}$/,
      },
    ],
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

apiParameterSchema.index({ apiMetadataId: 1, externalCode: 1 }, { unique: true });
apiParameterSchema.index({ koreanAddressCodes: 1 });

module.exports = mongoose.model('ApiParameter', apiParameterSchema);
