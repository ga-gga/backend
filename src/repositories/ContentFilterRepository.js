const ContentFilter = require('../models/contentFilter');
const DatabaseError = require('../errors/DatabaseError');
const NotFoundError = require('../errors/NotFoundError');

class ContentFilterRepository {
  async create(data) {
    try {
      const contentFilter = new ContentFilter(data);
      const savedContentFilter = await contentFilter.save();
      return savedContentFilter;
    } catch (error) {
      throw new Error(`Failed to create content filter: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      const updatedContentFilter = await ContentFilter.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedContentFilter) {
        throw new Error('Content filter not found');
      }

      return updatedContentFilter;
    } catch (error) {
      throw new Error(`Failed to update content filter: ${error.message}`);
    }
  }

  async findByType(type, filters = {}) {
    try {
      const query = { type, ...filters };
      const result = await ContentFilter.find(query).sort({ createdAt: -1 });

      if (!result) {
        throw new NotFoundError(`No ${type} content filters found`);
      }

      return result;
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to find content filters by type: ${error.message}`);
    }
  }
}

module.exports = ContentFilterRepository;
