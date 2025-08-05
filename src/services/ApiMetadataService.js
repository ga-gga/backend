const ApiMetadataRepository = require('../repositories/ApiMetadataRepository');
const NotFoundError = require('../errors/NotFoundError');

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
    const result = await this.apiMetadataRepository.findAll();

    if (!result || result.length === 0) {
      throw new NotFoundError('No API metadata found');
    }

    return result;
  }

  async getApiMetadataByName(name, { isActive } = {}) {
    const result = await this.apiMetadataRepository.findByName(name, { isActive });

    if (!result) {
      throw new NotFoundError(`API metadata not found for name: ${name}`);
    }

    return result;
  }
}

module.exports = ApiMetadataService;
