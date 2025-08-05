const axios = require('axios');
const EnvironmentDataService = require('../../services/EnvironmentService');
const EnvironmentDataMapper = require('../mappers/EnvironmentDataMapper');
const ApiParameterService = require('../../services/ApiParameterService');

class EnvironmentDataClient {
  constructor() {
    this.baseUrl = process.env.SEOUL_REAL_TIME_CITY_DATA_BASE_URL;
    this.apiKey = process.env.SEOUL_REAL_TIME_CITY_DATA_API_KEY;
    this.format = process.env.SEOUL_REAL_TIME_CITY_DATA_FORMAT;
    this.serviceType = process.env.SEOUL_REAL_TIME_CITY_DATA_SERVICE_TYPE;
    this.pagingStart = process.env.SEOUL_REAL_TIME_CITY_DATA_PAGING_START;
    this.pagingEnd = process.env.SEOUL_REAL_TIME_CITY_DATA_PAGING_END;

    this.environmentDataService = new EnvironmentDataService();
    this.environmentDataMapper = new EnvironmentDataMapper();
    this.apiParameterService = new ApiParameterService();

    this.client = this.createHttpClient();
  }

  createHttpClient() {
    const client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    client.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error),
    );

    return client;
  }

  async collectEnvironmentData(metadata) {
    try {
      console.log(`Starting environment data collection for metadata: ${metadata.name}`);

      const apiResponses = await this.fetchApiDataBatch(metadata);
      const processingResults = await this.storeEnvironmentDataBatch(apiResponses);

      return this.createSummaryReport(apiResponses, processingResults);
    } catch (error) {
      console.error('Failed to collect and store environment data:', error);
      throw error;
    }
  }

  async fetchApiDataBatch(metadata) {
    const apiParameters = await this.getApiParameters(metadata);

    console.log(`Found ${apiParameters.length} parameters`);

    return await this.performApiRequests(apiParameters);
  }

  async getApiParameters(metadata) {
    const metadataId = metadata._id;

    const apiParameters = await this.apiParameterService.getApiParametersByMetadataId(metadataId);
    if (!apiParameters || apiParameters.length === 0) {
      throw new Error(`No API parameters found for metadata : ${metadata.name} (${metadataId})`);
    }

    return apiParameters;
  }

  async performApiRequests(apiParameters) {
    const apiCalls = apiParameters.map((param) => this.fetchApiData(param));
    const results = await Promise.allSettled(apiCalls);

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return this.createFailedResponse(apiParameters[index], result.reason);
      }
    });
  }

  async fetchApiData(parameter) {
    try {
      const url = `/${this.apiKey}/${this.format}/${this.serviceType}/${this.pagingStart}/${this.pagingEnd}/${parameter.externalCode}`;
      const response = await this.client.get(url);

      return {
        success: true,
        parameter,
        data: response.data,
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.createFailedResponse(parameter, error);
    }
  }

  createFailedResponse(parameter, error) {
    return {
      success: false,
      parameter,
      error: error?.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }

  async storeEnvironmentDataBatch(apiResponses) {
    const savePromises = apiResponses.map((response) => this.transformAndStoreData(response));
    return await Promise.allSettled(savePromises);
  }

  async transformAndStoreData(apiResponse) {
    const parameterId = apiResponse.parameter?._id;
    const parameterCode = apiResponse.parameter?.externalCode;

    try {
      let transformedData = null;

      if (apiResponse.success && apiResponse.data) {
        transformedData = this.environmentDataMapper.transformApiResponse(parameterId, apiResponse);
      }

      const result = await this.environmentDataService.saveEnvironmentData(parameterId, transformedData);

      return {
        success: true,
        parameterId,
        parameterCode,
        hasData: !!transformedData,
        dataStatus: transformedData?.dataStatus,
        result,
      };
    } catch (error) {
      console.error(`Failed to process data for parameter ${parameterCode} (${parameterId}):`, error);
      return {
        success: false,
        parameterId,
        parameterCode,
        error: error.message,
      };
    }
  }

  createSummaryReport(apiResponses, processingResults) {
    const apiFailures = [];
    let apiSuccessful = 0;

    apiResponses.forEach((r) => {
      if (r.success) {
        apiSuccessful++;
      } else {
        const poiCode = r.parameter?.externalCode || 'UNKNOWN';
        apiFailures.push(`Call Api [${poiCode}]: ${r.error}`);
      }
    });

    const processingFailures = [];
    const dataQualityIssues = [];
    let processingSuccessful = 0;
    let completeDataCount = 0;

    processingResults.forEach((r) => {
      if (r.status === 'fulfilled' && r.value?.success) {
        processingSuccessful++;
        const dataStatus = r.value.dataStatus;

        if (dataStatus?.isComplete) {
          completeDataCount++;
        } else if (dataStatus?.missingFields?.length > 0) {
          const poiCode = r.value.parameterCode || 'UNKNOWN';
          dataQualityIssues.push(`Incomplete data [${poiCode}]: missing ${dataStatus.missingFields.join(', ')}`);
        }

        if (dataStatus?.errors?.length > 0) {
          const poiCode = r.value.parameterCode || 'UNKNOWN';
          dataStatus.errors.forEach((error) => {
            dataQualityIssues.push(`Data error [${poiCode}] ${error.field}: ${error.message}`);
          });
        }
      } else {
        const poiCode = r.value?.parameterCode || 'UNKNOWN';
        processingFailures.push(`Processing [${poiCode}]: ${r.value?.error || r.reason?.message || 'Unknown'}`);
      }
    });

    const summary = {
      timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      stats: {
        api: { total: apiResponses.length, successful: apiSuccessful },
        processing: { total: processingResults.length, successful: processingSuccessful },
        dataQuality: {
          total: processingSuccessful,
          complete: completeDataCount,
          incomplete: processingSuccessful - completeDataCount,
        },
      },
    };

    const allIssues = [...apiFailures, ...processingFailures, ...dataQualityIssues];
    if (allIssues.length > 0) {
      summary.issues = allIssues;
    }

    return summary;
  }
}

module.exports = EnvironmentDataClient;
