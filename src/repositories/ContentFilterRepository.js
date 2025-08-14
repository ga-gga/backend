const ContentFilter = require('../models/contentFilter');
const DatabaseError = require('../errors/DatabaseError');

class ContentFilterRepository {
  async create(data) {
    try {
      const contentFilter = new ContentFilter(data);
      const savedContentFilter = await contentFilter.save();
      return savedContentFilter;
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to create content filter: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const contentFilter = await ContentFilter.findById(id);
      return contentFilter;
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to find content filter by ID: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      const updatedContentFilter = await ContentFilter.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      return updatedContentFilter;
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to update content filter: ${error.message}`);
    }
  }

  async findByType(type, filters = {}) {
    try {
      const query = { type, ...filters };
      const result = await ContentFilter.find(query).sort({ createdAt: -1 });
      return result || [];
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to find content filters by type: ${error.message}`);
    }
  }
}

module.exports = ContentFilterRepository;
