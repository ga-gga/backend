const ContentFilterService = require('../services/ContentFilterService');

class ContentFilterController {
  constructor() {
    this.contentFilterService = new ContentFilterService();
  }

  async createContentFilter(req, res, next) {
    try {
      const contentFilterData = req.body;
      const createdContentFilter = await this.contentFilterService.createContentFilter(contentFilterData);
      res.status(201).json(createdContentFilter);
    } catch (error) {
      next(error);
    }
  }

  async updateContentFilter(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedContentFilter = await this.contentFilterService.updateContentFilter(id, updateData);
      res.json(updatedContentFilter);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ContentFilterController;
