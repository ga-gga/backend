const EnvironmentDataClient = require('../clients/EnvironmentDataClient');
const ApiMetadataService = require('../../services/ApiMetadataService');

class EnvironmentDataGeneratorService {
  constructor() {
    this.environmentDataClient = new EnvironmentDataClient();
    this.apiMetadataService = new ApiMetadataService();
  }

  async generateEnvironmentData() {
    try {
      console.log('Starting environment data generation in local mode...');

      const API_NAME = 'seoul_real_time_city_data';
      const apiMetadata = await this.apiMetadataService.getApiMetadataByName(API_NAME);
      const result = await this.environmentDataClient.collectEnvironmentData(apiMetadata);

      return {
        message: 'Environment data generation completed',
        result: result,
      };
    } catch (error) {
      console.error('Environment data generation failed:', error);
      throw new Error(`Failed to generate environment data: ${error.message}`);
    }
  }
}

module.exports = EnvironmentDataGeneratorService;
