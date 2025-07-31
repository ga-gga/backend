const ContentFilterRepository = require('../repositories/ContentFilterRepository');

class ContentFilterService {
  constructor() {
    this.contentFilterRepository = new ContentFilterRepository();
  }

  async createContentFilter(contentFilterData) {
    try {
      return await this.contentFilterRepository.create(contentFilterData);
    } catch (error) {
      throw new Error(`Failed to create content filter: ${error.message}`);
    }
  }

  async updateContentFilter(id, updateData) {
    try {
      if (!id) {
        throw new Error('Content filter ID is required');
      }

      const updatedContentFilter = await this.contentFilterRepository.updateById(id, updateData);

      if (!updatedContentFilter) {
        throw new Error('Content filter not found');
      }

      return updatedContentFilter;
    } catch (error) {
      throw new Error(`Failed to update content filter: ${error.message}`);
    }
  }
}

module.exports = ContentFilterService;
