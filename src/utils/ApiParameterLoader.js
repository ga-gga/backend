const fs = require('fs').promises;
const path = require('path');
const ApiParameterService = require('../services/ApiParameterService');

class ApiParameterLoader {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data');
    this.fileName = 'seoul_real_time_city_data_parameter.json';
    this.ApiParameterService = new ApiParameterService();
  }

  async loadStart() {
    console.log('Loading API parameter data...');

    try {
      const fileData = await this.readFile();
      const apiName = fileData.apiName;

      const isInitialized = await this.ApiParameterService.isInitializedByApiName(apiName);
      if (isInitialized) {
        console.log(`${apiName}' already loaded, skipping...`);
        return;
      }

      await this.loadData(fileData);
    } catch (error) {
      console.error(`Failed to load data: ${error.message}`);
    }
  }

  async readFile() {
    try {
      const filePath = path.join(this.dataPath, this.fileName);
      const rawData = await fs.readFile(filePath, 'utf-8');
      const fileData = JSON.parse(rawData);

      if (!fileData.apiName) {
        throw new Error('Missing apiName filed.');
      }

      if (!fileData.parameters) {
        throw new Error('Missing parameters filed.');
      }

      console.log(`Read ${this.fileName} file, ${fileData.parameters.length} exist`);

      return fileData;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`file not found: ${this.fileName}`);
      }
      throw error;
    }
  }

  async loadData(fileData) {
    try {
      const { apiName, parameters } = fileData;
      const result = await this.ApiParameterService.saveApiParameters(apiName, parameters);

      console.log(`data loaded successfully: ${result}`);
    } catch (error) {
      console.error(`Failed to load data: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ApiParameterLoader();
