const ContentFilter = require('../models/contentFilter');
const DatabaseError = require('../errors/DatabaseError');
const NotFoundError = require('../errors/NotFoundError');

class ContentFilterRepository {
  async create(data) {
    const contentFilter = new ContentFilter(data);
    return await contentFilter.save();
  }

  async updateById(id, updateData) {
    return await ContentFilter.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
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
