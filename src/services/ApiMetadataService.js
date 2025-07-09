const ApiMetadataRepository = require('../repositories/ApiMetadataRepository');

class ApiMetadataService {
  constructor() {
    this.apiMetadataRepository = new ApiMetadataRepository();
  }

  async createApiMetadata(apiMetadataData) {
    const { name, isActive, updateInterval } = apiMetadataData;

    if (!name || !updateInterval) {
      throw new Error('Name and updateInterval are required');
    }

    if (updateInterval < 60) {
      throw new Error('Update interval must be at least 60 seconds');
    }

    const existingApiMetadata = await this.apiMetadataRepository.findByName(name);
    if (existingApiMetadata) {
      throw new Error(`API metadata with name '${name}' already exists`);
    }

    const createdApiMetadata = await this.apiMetadataRepository.create({
      name,
      isActive: isActive || false,
      updateInterval,
    });

    return createdApiMetadata;
  }

  async getAllApiMetadata() {
    return await this.apiMetadataRepository.findAll();
  }
}

module.exports = ApiMetadataService;
