const fs = require('fs').promises;
const path = require('path');
const ApiParameterService = require('../../services/ApiParameterService');
const ApiMetadataService = require('../../services/ApiMetadataService');

class ApiParameterLoader {
  constructor() {
    this.dataPath = path.join(__dirname, '../../../data');
    this.fileName = 'seoul_real_time_city_data_parameter.json';
    this.ApiParameterService = new ApiParameterService();
    this.ApiMetadataService = new ApiMetadataService();
  }

  async loadStart() {
    console.log('  ↳ Loading API parameter data...');

    try {
      const fileData = await this.readFile();
      await this.ensureApiMetadata(fileData);
      await this.ensureApiParameters(fileData);
    } catch (error) {
      console.error(`  ↳ Failed to load data: ${error.message}`);
      throw error;
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

      console.log(`    - Read ${this.fileName} file, ${fileData.parameters.length} exist`);

      return fileData;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`file not found: ${this.fileName}`);
      }
      throw error;
    }
  }

  async ensureApiMetadata(fileData) {
    const { apiName, isActive } = fileData;

    try {
      const existingMetadata = await this.ApiMetadataService.getApiMetadataByName(apiName);
      if (existingMetadata) {
        console.log(`    - API metadata '${apiName}' already exists`);
        return existingMetadata;
      }

      const metadataToCreate = {
        name: apiName,
        isActive: isActive || true,
      };

      const createdMetadata = await this.ApiMetadataService.createApiMetadata(metadataToCreate);
      console.log(`    - Created API metadata: ${apiName}`);

      return createdMetadata;
    } catch (error) {
      throw new Error(`Failed to ensure API metadata: ${error.message}`);
    }
  }

  async ensureApiParameters(fileData) {
    const { apiName } = fileData;

    try {
      const isInitialized = await this.ApiParameterService.isInitializedByApiName(apiName);
      if (isInitialized) {
        console.log(`    - API parameters for '${apiName}' already loaded, skipping...`);
        return;
      }

      await this.loadData(fileData);
    } catch (error) {
      throw new Error(`Failed to ensure API parameters: ${error.message}`);
    }
  }

  async loadData(fileData) {
    try {
      const { apiName, parameters } = fileData;
      const result = await this.ApiParameterService.saveApiParameters(apiName, parameters);

      console.log(`    - Data loaded successfully for ${apiName}:`);
      console.log(`      · Requested parameters: ${result.requested}`);
      console.log(`      · Saved records: ${result.saved}`);
    } catch (error) {
      console.error(`Failed to load data: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ApiParameterLoader();
