const KoreanAddressService = require('../services/KoreanAddressService');

class KoreanAddressController {
  constructor() {
    this.koreanAddressService = new KoreanAddressService();
  }

  async getGroupedAddresses(req, res, next) {
    try {
      const groupedAddresses = await this.koreanAddressService.getGroupedAddresses();
      res.json(groupedAddresses);
    } catch (error) {
      next(error);
    }
  }

  async checkInitialization(req, res, next) {
    try {
      const isInitialized = await this.koreanAddressService.isInitialized();
      res.json({ initialized: isInitialized });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = KoreanAddressController;
