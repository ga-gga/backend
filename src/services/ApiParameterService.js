const ApiParameterRepository = require('../repositories/ApiParameterRepository');
const ApiMetadataRepository = require('../repositories/ApiMetadataRepository');

class ApiParameterService {
  constructor() {
    this.apiParameterRepository = new ApiParameterRepository();
    this.apiMetadataRepository = new ApiMetadataRepository();
  }

  async isInitializedByApiName(apiName) {
    const apiMetadata = await this.apiMetadataRepository.findByName(apiName);
    const count = await this.apiParameterRepository.countByApiMetadata(apiMetadata._id);
    return count > 0;
  }

  async saveApiParameters(apiName, parameters) {
    if (!Array.isArray(parameters) || parameters.length === 0) {
      throw new Error('Invalid parameter data array format');
    }

    const apiMetadata = await this.apiMetadataRepository.findByName(apiName);
    if (!apiMetadata) {
      throw new Error(`API metadata not found for: ${apiName}`);
    }

    const transformedData = await this.transformParameterData(parameters, apiMetadata._id);

    const savedData = await this.apiParameterRepository.saveMany(transformedData);

    return {
      requested: parameters.length,
      saved: savedData.length,
      savedData,
    };
  }

  transformParameterData(parameters, apiMetadataId) {
    const transformedData = [];
    const validationErrors = [];

    for (const param of parameters) {
      const { code, name, koreanAddressCode } = param;

      if (!code || !name) {
        validationErrors.push(`Missing fields in parameter: ${JSON.stringify(param)}`);
        continue;
      }

      if (Array.isArray(koreanAddressCode)) {
        for (const koreanCode of koreanAddressCode) {
          transformedData.push({
            externalCode: code,
            name,
            koreanAddressCode: koreanCode,
            apiMetadataId,
            isActive: true,
          });
        }
      } else if (koreanAddressCode) {
        transformedData.push({
          externalCode: code,
          name,
          koreanAddressCode,
          apiMetadataId,
          isActive: true,
        });
      } else {
        validationErrors.push(`Invalid Korean address code: ${koreanAddressCode} for ${code}`);
      }
    }

    if (validationErrors.length > 0) {
      console.warn('Validation warnings during transformation:');
      validationErrors.forEach((error) => console.warn(`- ${error}}`));
    }

    return transformedData;
  }
}

module.exports = ApiParameterService;
