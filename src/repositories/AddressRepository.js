const Address = require('../models/Address');

class AddressRepository {
  async hasData() {
    try {
      const count = await Address.countDocuments();
      return count > 0;
    } catch (error) {
      console.error('Error checking if data exists:', error);
      throw new Error('Failed to check data existence');
    }
  }

  async save(addressData) {
    try {
      return await Address.create(addressData);
    } catch (error) {
      console.error('Error saving address data:', error);
      throw new Error('Failed to save address data');
    }
  }

  async findAddressSystem() {
    try {
      return await Address.findOne();
    } catch (error) {
      console.error('Error finding address system:', error);
      throw new Error('Failed to retrieve address system');
    }
  }

  async findGuByCode(guCode) {
    try {
      const result = await Address.findOne({ 'gus.code': guCode }, { 'gus.$': 1 });
      return result?.gus[0] || null;
    } catch (error) {
      console.error('Error finding gu by code:', error);
      throw new Error('Failed to find gu by code');
    }
  }

  async findDongByCode(dongCode) {
    try {
      const result = await Address.aggregate([
        { $unwind: '$gus' },
        { $unwind: '$gus.dongs' },
        { $match: { 'gus.dongs.code': dongCode } },
        {
          $project: {
            gu: {
              name: '$gus.name',
              code: '$gus.code',
            },
            dong: {
              name: '$gus.dongs.name',
              code: '$gus.dongs.code',
            },
          },
        },
      ]);
      return result[0] || null;
    } catch (error) {
      console.error('Error finding dong by code:', error);
      throw new Error('Failed to find dong by code');
    }
  }
}

module.exports = AddressRepository;
