const ApiMetadataRepository = require('../repositories/ApiMetadataRepository');

class ApiMetadataService {
  constructor() {
    this.apiMetadataRepository = new ApiMetadataRepository();
  }

  async createApiMetadata(apiMetadataData) {
    const { name, isActive } = apiMetadataData;

    if (!name) {
      throw new Error('Name is required');
    }

    const existingApiMetadata = await this.apiMetadataRepository.findByName(name);
    if (existingApiMetadata) {
      throw new Error(`API metadata with name '${name}' already exists`);
    }

    const createdApiMetadata = await this.apiMetadataRepository.create({
      name,
      isActive: isActive || false,
    });

    return createdApiMetadata;
  }

  async getAllApiMetadata() {
    return await this.apiMetadataRepository.findAll();
  }

  async getApiMetadataByName(name, { isActive } = {}) {
    return await this.apiMetadataRepository.findByName(name, { isActive });
  }
}

module.exports = ApiMetadataService;
