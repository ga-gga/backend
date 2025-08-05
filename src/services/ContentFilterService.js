const ContentFilterRepository = require('../repositories/ContentFilterRepository');
const NotFoundError = require('../errors/NotFoundError');

class ContentFilterService {
  constructor() {
    this.contentFilterRepository = new ContentFilterRepository();
  }

  async createContentFilter(contentFilterData) {
    return await this.contentFilterRepository.create(contentFilterData);
  }

  async updateContentFilter(id, updateData) {
    if (!id) {
      throw new Error('Content filter ID is required');
    }

    const updatedContentFilter = await this.contentFilterRepository.updateById(id, updateData);

    if (!updatedContentFilter) {
      throw new NotFoundError('Content filter not found');
    }

    return updatedContentFilter;
  }

  async getContentFiltersByType(type, filters = {}) {
    const result = await this.contentFilterRepository.findByType(type, filters);

    if (!result || result.length === 0) {
      throw new NotFoundError(`No ${type} content filters found`);
    }

    return result;
  }
}

module.exports = ContentFilterService;
