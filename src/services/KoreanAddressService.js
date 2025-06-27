const KoreanAddressRepository = require('../repositories/KoreanAddressRepository');

class KoreanAddressService {
  constructor() {
    this.koreanAddressRepository = new KoreanAddressRepository();
  }

  async isInitialized() {
    return await this.koreanAddressRepository.hasData();
  }

  async saveAddresses(addressDataArray) {
    if (!Array.isArray(addressDataArray) || addressDataArray.length === 0) {
      throw new Error('Invalid address data array format');
    }

    const savedData = await this.koreanAddressRepository.saveMany(addressDataArray);

    return {
      requested: addressDataArray.length,
      saved: savedData.length,
      savedData,
    };
  }

  async getStatistics() {
    const addressesByLevel = await this.getGroupedAddresses();

    return {
      count: Object.values(addressesByLevel).reduce((sum, arr) => sum + arr.length, 0),
      levelCounts: {
        SIDO: addressesByLevel.SIDO.length,
        SIGUNGU: addressesByLevel.SIGUNGU.length,
        EUPMYEONDONG: addressesByLevel.EUPMYEONDONG.length,
        RI: addressesByLevel.RI.length,
      },
    };
  }

  async getGroupedAddresses() {
    const groupedData = await this.koreanAddressRepository.findGroupByLevel();

    const result = {
      SIDO: [],
      SIGUNGU: [],
      EUPMYEONDONG: [],
      RI: [],
    };

    groupedData.forEach((group) => {
      if (result[group._id]) {
        result[group._id] = group.addresses;
      }
    });

    return result;
  }
}

module.exports = KoreanAddressService;
