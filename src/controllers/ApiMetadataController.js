const ApiMetadataService = require('../services/ApiMetadataService');

class ApiMetadataController {
  constructor() {
    this.apiMetadataService = new ApiMetadataService();
  }

  async createApiMetadata(req, res, next) {
    try {
      const apiMetadataData = req.body;
      const createdApiMetadata = await this.apiMetadataService.createApiMetadata(apiMetadataData);
      res.status(201).json(createdApiMetadata);
    } catch (error) {
      next(error);
    }
  }

  async getAllApiMetadata(req, res, next) {
    try {
      const apiMetadataList = await this.apiMetadataService.getAllApiMetadata();
      res.json(apiMetadataList);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ApiMetadataController;
