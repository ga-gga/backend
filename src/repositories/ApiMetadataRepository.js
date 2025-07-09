const ApiMetadata = require('../models/apiMetadata');

class ApiMetadataRepository {
  async create(apiMetadataData) {
    try {
      const apiMetadata = new ApiMetadata(apiMetadataData);
      return await apiMetadata.save();
    } catch (error) {
      throw new Error(`Failed to create API metadata: ${error.message}`);
    }
  }

  async findByName(name) {
    try {
      return await ApiMetadata.findOne({ name });
    } catch (error) {
      throw new Error(`Failed to find API metadata by name: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await ApiMetadata.find();
    } catch (error) {
      throw new Error(`Failed to retrieve API metadata: ${error.message}`);
    }
  }
}

module.exports = ApiMetadataRepository;
