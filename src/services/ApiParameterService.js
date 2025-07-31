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
      const { code, name, koreanAddressCode, address, imageUrl, description } = param;

      if (!code || !name || !address) {
        validationErrors.push(`Missing fields in parameter: ${JSON.stringify(param)}`);
        continue;
      }

      let koreanAddressCodes = [];
      if (Array.isArray(koreanAddressCode)) {
        koreanAddressCodes = koreanAddressCode;
      } else if (koreanAddressCode) {
        koreanAddressCodes = [koreanAddressCode];
      } else {
        validationErrors.push(`Invalid Korean address code: ${koreanAddressCode} for ${code}`);
        continue;
      }

      transformedData.push({
        externalCode: code,
        name,
        address,
        koreanAddressCodes,
        apiMetadataId,
        imageUrl,
        description,
        isActive: true,
      });
    }

    if (validationErrors.length > 0) {
      console.warn('Validation warnings during transformation:');
      validationErrors.forEach((error) => console.warn(`- ${error}`));
    }

    return transformedData;
  }

  async getApiParametersByMetadataId(apiMetadataId) {
    return await this.apiParameterRepository.findByApiMetadata(apiMetadataId);
  }
}

module.exports = ApiParameterService;
