const KoreanAddress = require('../models/koreanAddress');
const DatabaseError = require('../errors/DatabaseError');

class KoreanAddressRepository {
  async hasData() {
    try {
      const count = await KoreanAddress.estimatedDocumentCount();
      return count > 0;
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to check data existence: ${error.message}`);
    }
  }

  async saveMany(addressDataArray) {
    try {
      return await KoreanAddress.insertMany(addressDataArray, { ordered: false });
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to save multiple address data: ${error.message}`);
    }
  }

  async findGroupByLevel() {
    try {
      const result = await KoreanAddress.aggregate([
        {
          $sort: { level: 1, name: 1 },
        },
        {
          $group: {
            _id: '$level',
            addresses: {
              $push: { id: '$_id', name: '$name', parentCode: '$parentCode' },
            },
          },
        },
      ]);

      return result || [];
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      throw new Error(`Failed to retrieve grouped address data: ${error.message}`);
    }
  }
}

module.exports = KoreanAddressRepository;
