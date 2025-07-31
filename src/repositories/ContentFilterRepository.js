const ContentFilter = require('../models/contentFilter');

class ContentFilterRepository {
  async create(data) {
    try {
      const contentFilter = new ContentFilter(data);
      return await contentFilter.save();
    } catch (error) {
      throw new Error(`Failed to create content filter: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      return await ContentFilter.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } catch (error) {
      throw new Error(`Failed to update content filter: ${error.message}`);
    }
  }

  async findByType(type, filters = {}) {
    try {
      const query = { type, ...filters };
      return await ContentFilter.find(query).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Failed to find content filters by type: ${error.message}`);
    }
  }
}

module.exports = ContentFilterRepository;
