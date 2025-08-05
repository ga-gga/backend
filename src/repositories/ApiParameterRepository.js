const ApiParameter = require('../models/apiParameter.js');
const DatabaseError = require('../errors/DatabaseError');

class ApiParameterRepository {
  async hasData() {
    try {
      const count = await ApiParameter.estimatedDocumentCount();
      return count > 0;
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to check ApiParameter data existence: ${error.message}`);
    }
  }

  async saveMany(apiParameterDataArray) {
    try {
      return await ApiParameter.insertMany(apiParameterDataArray, { ordered: false });
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to save multiple ApiParameter data: ${error.message}`);
    }
  }

  async countByApiMetadata(apiMetadataId) {
    try {
      return await ApiParameter.countDocuments({ apiMetadataId });
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to count ApiParameter by apiMetadataId: ${error.message}`);
    }
  }

  async findByApiMetadata(apiMetadataId) {
    try {
      return await ApiParameter.find({ apiMetadataId });
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to find ApiParameter: ${error.message}`);
    }
  }
}

module.exports = ApiParameterRepository;
