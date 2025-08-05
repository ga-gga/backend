const Environment = require('../models/environment');
const DatabaseError = require('../errors/DatabaseError');

class EnvironmentRepository {
  async save(environmentData) {
    try {
      const environment = new Environment(environmentData);
      const savedEnvironment = await environment.save();
      return savedEnvironment;
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to save environment: ${error.message}`);
    }
  }
}

module.exports = EnvironmentRepository;
