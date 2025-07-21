const Environment = require('../models/environment');

class EnvironmentRepository {
  async save(environmentData) {
    try {
      const environment = new Environment(environmentData);
      return await environment.save();
    } catch (error) {
      throw new Error(`Failed to save Environment data: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await Environment.findAll();
    } catch (error) {
      throw new Error(`Failed to retrieve environment: ${error.message}`);
    }
  }
}

module.exports = EnvironmentRepository;
