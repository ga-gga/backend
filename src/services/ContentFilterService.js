const ContentFilterRepository = require('../repositories/ContentFilterRepository');

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
      throw new Error('Content filter not found');
    }

    return updatedContentFilter;
  }
}

module.exports = ContentFilterService;
