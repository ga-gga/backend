const fs = require('fs').promises;
const path = require('path');
const KoreanAddressService = require('../../services/KoreanAddressService');

class KoreanAddressLoader {
  constructor() {
    this.dataPath = path.join(__dirname, '../../../data');
    this.koreanAddressService = new KoreanAddressService();
  }

  async loadStart() {
    console.log('Loading Korean address data...');

    try {
      const isInitialized = await this.koreanAddressService.isInitialized();
      if (isInitialized) {
        console.log('Korean address data already loaded, skipping...');
        return;
      }

      await this.loadAddressData();

      const stats = await this.koreanAddressService.getStatistics();
      console.log('Korean address data loading completed:', stats);
    } catch (error) {
      console.error(`Failed to load Korean address data: ${error.message}`);
      throw error;
    }
  }

  async loadAddressData() {
    try {
      const filePath = path.join(this.dataPath, 'seoul_address_data.json');
      const rawData = await fs.readFile(filePath, 'utf8');
      const addresses = JSON.parse(rawData);
      const transformedData = this.transformData(addresses);
      const result = await this.koreanAddressService.saveAddresses(transformedData);

      console.log(`address data loaded successfully - Total: ${result.saved}/${result.requested}`);

      return result;
    } catch (error) {
      console.error(`Failed to load address data: ${error.message}`);
      throw error;
    }
  }

  transformData(addresses) {
    const transformedData = [];

    addresses.forEach((address) => {
      const { name, code } = address;
      const level = this.determineLevel(code);
      const parentCode = this.determineParentCode(code, level);

      transformedData.push({
        _id: code,
        name,
        level,
        parentCode,
      });
    });

    return transformedData;
  }

  determineLevel(code) {
    if (code.length !== 10) {
      throw new Error(`Invalid code format: ${code}. Must be 10 digits.`);
    }

    const siGunGu = code.substring(2, 5);
    const eupMyeonDong = code.substring(5, 8);
    const ri = code.substring(8, 10);

    if (siGunGu === '000' && eupMyeonDong === '000' && ri === '00') {
      return 'SIDO';
    }

    if (siGunGu !== '000' && eupMyeonDong === '000' && ri === '00') {
      return 'SIGUNGU';
    }

    if (eupMyeonDong !== '000' && ri === '00') {
      return 'EUPMYEONDONG';
    }

    if (ri !== '00') {
      return 'RI';
    }
  }

  determineParentCode(code, level) {
    const siDo = code.substring(0, 2);
    const siGunGu = code.substring(2, 5);
    const eupMyeonDong = code.substring(5, 8);

    switch (level) {
      case 'SIDO':
        return null;

      case 'SIGUNGU':
        return siDo + '00000000';

      case 'EUPMYEONDONG':
        return siDo + siGunGu + '00000';

      case 'RI':
        return siDo + siGunGu + eupMyeonDong + '00';

      default:
        return null;
    }
  }
}

module.exports = new KoreanAddressLoader();
