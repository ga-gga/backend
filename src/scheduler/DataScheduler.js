const cron = require('node-cron');
const EnvironmentDataClient = require('../utils/EnvironmentDataClient');
const ApiMetadataService = require('../services/ApiMetadataService');

class DataScheduler {
  constructor() {
    this.client = new EnvironmentDataClient();
    this.ApiMetadataService = new ApiMetadataService();
    this.API_NAME = 'seoul_real_time_city_data';
  }

  start() {
    cron.schedule('*/10 * * * *', async () => {
      const result = await this.runEnvironmentDataCollection();
      console.log(result);
    });
  }

  async runEnvironmentDataCollection() {
    const apiMetadata = await this.ApiMetadataService.getApiMetadataByName(this.API_NAME);
    return await this.client.collectEnvironmentData(apiMetadata);
  }
}

module.exports = DataScheduler;
