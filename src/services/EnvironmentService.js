const EnvironmentRepository = require('../repositories/EnvironmentRepository');
const NotFoundError = require('../errors/NotFoundError');

class EnvironmentService {
  constructor() {
    this.environmentRepository = new EnvironmentRepository();
  }

  async saveEnvironmentData(apiParameterId, transformedData) {
    try {
      if (!transformedData) {
        const notFoundError = new NotFoundError('No environment data available');
        const errorAttribute = this.createErrorAttribute(apiParameterId, notFoundError);
        return await this.environmentRepository.save(errorAttribute);
      }

      return await this.environmentRepository.save(transformedData);
    } catch (error) {
      console.error('Failed to save environment data:', error);

      try {
        const errorAttribute = this.createErrorAttribute(apiParameterId, error);
        await this.environmentRepository.save(errorAttribute);
      } catch (saveError) {
        throw new Error(`Failed to save environment data: ${saveError.message}`);
      }
    }
  }

  createErrorAttribute(apiParameterId, error) {
    return {
      apiParameterId,
      dataCollectedAt: new Date(),
      dataStatus: {
        isComplete: false,
        lastUpdated: new Date(),
        errors: [
          {
            field: 'general',
            message: error.message,
            timestamp: new Date(),
          },
        ],
      },
    };
  }
}

module.exports = EnvironmentService;
