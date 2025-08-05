const ApiMetadata = require('../models/apiMetadata');
const DatabaseError = require('../errors/DatabaseError');

class ApiMetadataRepository {
  async create(apiMetadataData) {
    try {
      const apiMetadata = new ApiMetadata(apiMetadataData);
      return await apiMetadata.save();
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to create API metadata: ${error.message}`);
    }
  }

  async findByName(name, options = {}) {
    try {
      const query = { name };

      if (options.isActive !== undefined) {
        query.isActive = options.isActive;
      }

      return await ApiMetadata.findOne(query);
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to find API metadata by name: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await ApiMetadata.find();
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to retrieve API metadata: ${error.message}`);
    }
  }
}

module.exports = ApiMetadataRepository;
