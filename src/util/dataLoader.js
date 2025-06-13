const fs = require('fs').promises;
const path = require('path');
const AddressService = require('../services/AddressService');

class DataLoader {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data');
    this.addressService = new AddressService();
  }

  async loadSeoulAddressData() {
    try {
      const filePath = path.join(this.dataPath, 'seoul_address_data_code_mapping.json');
      const rawData = await fs.readFile(filePath, 'utf8');
      const seoulData = JSON.parse(rawData);

      const addressData = {
        city: seoulData.city,
        code: seoulData.code,
        gus: seoulData.gus.map(gu => ({
          name: gu.gu,
          code: gu.code,
          dongs: gu.dongs.map(dong => ({
            name: dong.dong,
            code: dong.code,
          })),
        })),
      };

      const result = await this.addressService.saveAddressSystem(addressData);

      console.log(
        `Seoul address data loaded successfully - Gu: ${result.stats.totalGus}, Dong: ${result.stats.totalDongs}`
      );

      return result.stats;
    } catch (error) {
      console.error(`Failed to load Seoul address data: ${error.message}`);
      throw error;
    }
  }

  async loadAllStaticData() {
    console.log('Loading static data...');

    try {
      // Check if data already exists
      const isInitialized = await this.addressService.isInitialized();
      if (isInitialized) {
        console.log('Static data already loaded, skipping...');
        return;
      }

      await this.loadSeoulAddressData();
      console.log('Static data loading completed successfully');
    } catch (error) {
      console.error(`Failed to load static data: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new DataLoader();
