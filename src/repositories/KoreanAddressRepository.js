const KoreanAddress = require('../models/KoreanAddress');

class KoreanAddressRepository {
  /**
   * Checks if the KoreanAddress collection has any data.
   * @returns {Promise<boolean>} True if there is data, false otherwise.
   * @throws {Error} If there is an error while checking the data.
   */
  async hasData() {
    try {
      const count = await KoreanAddress.estimatedDocumentCount();
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check data existence: ${error.message}`);
    }
  }

  /**
   * Saves multiple address data objects to the KoreanAddress collection.
   * @param {Array} addressDataArray - An array of address data objects to be saved.
   * @returns {Promise<Array>} An array of saved address data objects.
   * @throws {Error} If there is an error while saving the data.
   */
  async saveMany(addressDataArray) {
    try {
      return await KoreanAddress.insertMany(addressDataArray, { ordered: false });
    } catch (error) {
      throw new Error(`Failed to save multiple address data: ${error.message}`);
    }
  }

  /**
   * Retrieves all address data from the KoreanAddress collection.
   * @returns {Promise<Array>} An array of all address data objects.
   * @throws {Error} If there is an error while retrieving the data.
   */
  async findGroupByLevel() {
    try {
      return await KoreanAddress.aggregate([
        {
          $sort: { level: 1, name: 1 },
        },
        {
          $group: {
            _id: '$level',
            addresses: {
              $push: { code: '$code', name: '$name', parentCode: '$parentCode' },
            },
          },
        },
      ]);
    } catch (error) {
      throw new Error(`Failed to retrieve grouped address data: ${error.message}`);
    }
  }
}

module.exports = KoreanAddressRepository;
