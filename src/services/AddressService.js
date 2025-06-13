const AddressRepository = require('../repositories/AddressRepository');

class AddressService {
  constructor() {
    this.addressRepository = new AddressRepository();
  }

  async isInitialized() {
    return await this.addressRepository.hasData();
  }

  async saveAddressSystem(addressData) {
    if (!addressData || !addressData.gus || !Array.isArray(addressData.gus)) {
      throw new Error('Invalid address data format');
    }

    const savedData = await this.addressRepository.save(addressData);
    const stats = await this.getStatistics();

    return { savedData, stats };
  }

  async getStatistics() {
    const addressData = await this.addressRepository.findAddressSystem();
    if (!addressData) {
      return { totalGus: 0, totalDongs: 0 };
    }

    const totalGus = addressData.gus.length;
    const totalDongs = addressData.gus.reduce((total, gu) => total + gu.dongs.length, 0);

    return { totalGus, totalDongs };
  }

  async getGus() {
    const addressData = await this.addressRepository.findAddressSystem();
    if (!addressData) return [];

    return addressData.gus
      .map(gu => ({
        name: gu.name,
        code: gu.code,
        dongCount: gu.dongs.length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getDongs(guCode) {
    const gu = await this.addressRepository.findGuByCode(guCode);
    if (!gu) {
      throw new Error(`Gu not found with code: ${guCode}`);
    }

    return gu.dongs
      .map(dong => ({
        name: dong.name,
        code: dong.code,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getAddressByCode(code) {
    if (!code || code.length !== 10) {
      throw new Error('Invalid code format. Code must be 10 digits');
    }

    const isGuCode = code.endsWith('000000');

    if (isGuCode) {
      const gu = await this.addressRepository.findGuByCode(code);
      if (!gu) {
        throw new Error(`Gu not found with code: ${code}`);
      }
      return {
        type: 'gu',
        gu: { name: gu.name, code: gu.code },
        dongs: gu.dongs,
        dongCount: gu.dongs.length,
      };
    } else {
      const dong = await this.addressRepository.findDongByCode(code);
      if (!dong) {
        throw new Error(`Dong not found with code: ${code}`);
      }
      return {
        type: 'dong',
        ...dong,
      };
    }
  }
}

module.exports = AddressService;
