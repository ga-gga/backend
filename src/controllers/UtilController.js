const EnvironmentDataGeneratorService = require('../utils/services/EnvironmentDataGeneratorService');

class UtilController {
  constructor() {
    this.environmentDataGeneratorService = new EnvironmentDataGeneratorService();
  }

  async generateEnvironmentData(req, res, next) {
    try {
      const result = await this.environmentDataGeneratorService.generateEnvironmentData();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UtilController;
