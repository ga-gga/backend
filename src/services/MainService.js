const ContentFilterRepository = require('../repositories/ContentFilterRepository');
const ApiParameterRepository = require('../repositories/ApiParameterRepository');
const EnvironmentRepository = require('../repositories/EnvironmentRepository');
const KoreanAddressRepository = require('../repositories/KoreanAddressRepository');

class MainService {
  constructor() {
    this.contentFilterRepository = new ContentFilterRepository();
    this.apiParameterRepository = new ApiParameterRepository();
    this.environmentRepository = new EnvironmentRepository();
    this.koreanAddressRepository = new KoreanAddressRepository();
  }

  async getMainData() {
    try {
      const [banners, categories, regions] = await Promise.all([
        this.getBanners(),
        this.getCategoriesWithContents(),
        this.getRegionsWithStats(),
      ]);

      return {
        banners,
        categories,
        regions,
      };
    } catch (error) {
      throw new Error(`Failed to get home data: ${error.message}`);
    }
  }

  async getBanners() {
    try {
      const banners = await this.contentFilterRepository.findByType('BANNER', { isActive: true });

      return banners.map((banner) => ({
        id: banner._id.toString(),
        title: banner.title,
        description: banner.description,
        imageUrl: banner.imageUrl,
        icon: banner.icon,
      }));
    } catch (error) {
      throw new Error(`Failed to get banners: ${error.message}`);
    }
  }

  async getCategoriesWithContents() {
    try {
      const categories = await this.contentFilterRepository.findByType('CATEGORY', { isActive: true });

      const categoriesWithContents = [];

      for (const category of categories) {
        const contents = await this.getFilteredContents(category.filterCondition);

        categoriesWithContents.push({
          id: category._id.toString(),
          title: category.title,
          description: category.description,
          contents,
        });
      }

      return categoriesWithContents;
    } catch (error) {
      throw new Error(`Failed to get categories with contents: ${error.message}`);
    }
  }

  async getFilteredContents(filterCondition) {
    try {
      if (!filterCondition || this.isEmptyFilterCondition(filterCondition)) {
        return [];
      }

      const filteredResults = await this.environmentRepository.findFilteredContentsWithApiParameters(filterCondition);

      return filteredResults.map((item) => ({
        name: item.apiParameter.name,
        description: item.apiParameter.description || '',
        address: item.apiParameter.address,
        imageUrl: item.apiParameter.imageUrl,
        metrics: {
          weather: item.currentSkyStatus || 'unknown',
          temperature: item.environmentData.weather?.temperature || 0,
          congestion: item.environmentData.population?.congestionLevel || 'unknown',
        },
      }));
    } catch (error) {
      throw new Error(`Failed to get filtered contents: ${error.message}`);
    }
  }

  isEmptyFilterCondition(filterCondition) {
    return (
      (!filterCondition.congestion || filterCondition.congestion.length === 0) &&
      (!filterCondition.skyStatus || filterCondition.skyStatus.length === 0) &&
      (!filterCondition.temperature ||
        (filterCondition.temperature.min === undefined && filterCondition.temperature.max === undefined))
    );
  }

  async getRegionsWithStats() {
    try {
      const addressGroups = await this.koreanAddressRepository.findGroupByLevel();
      const sigunguAddresses = addressGroups.find((group) => group._id === 'SIGUNGU')?.addresses;

      if (!sigunguAddresses?.length) {
        return [];
      }

      const districtCodes = sigunguAddresses.map((addr) => addr.id);
      const stats = await this.environmentRepository.findStatsByAllDistricts(districtCodes);
      const statsMap = new Map(stats.map((stat) => [stat._id, stat]));

      return sigunguAddresses.map((address) => ({
        id: address.id,
        name: address.name,
        thumbnailUrl: address.thumbnailUrl,
        metrics: {
          weather: statsMap.get(address.id)?.currentSkyStatus || 'unknown',
          temperature: Math.round(statsMap.get(address.id)?.avgTemperature || 0),
          minTemperature: Math.round(statsMap.get(address.id)?.minTemperature || 0),
          maxTemperature: Math.round(statsMap.get(address.id)?.maxTemperature || 0),
          congestion: statsMap.get(address.id)?.mostFrequentCongestion || 'unknown',
        },
      }));
    } catch (error) {
      throw new Error(`Failed to get regions with stats: ${error.message}`);
    }
  }
}

module.exports = MainService;
