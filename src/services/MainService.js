const ContentFilterRepository = require('../repositories/ContentFilterRepository');
const ApiParameterRepository = require('../repositories/ApiParameterRepository');
const EnvironmentRepository = require('../repositories/EnvironmentRepository');
const EnvironmentAggregationRepository = require('../repositories/EnvironmentAggregationRepository');
const KoreanAddressRepository = require('../repositories/KoreanAddressRepository');
const NotFoundError = require('../errors/NotFoundError');

class MainService {
  constructor() {
    this.contentFilterRepository = new ContentFilterRepository();
    this.apiParameterRepository = new ApiParameterRepository();
    this.environmentRepository = new EnvironmentRepository();
    this.environmentAggregationRepository = new EnvironmentAggregationRepository();
    this.koreanAddressRepository = new KoreanAddressRepository();
  }

  async getMainData() {
    const results = await Promise.allSettled([
      this.getBanners(),
      this.getCategoriesWithContents(),
      this.getRegionsWithStats(),
    ]);

    const allFailed = results.every((result) => result.status === 'rejected');
    if (allFailed) {
      throw new Error('All main data sources failed');
    }

    return {
      banners: results[0].status === 'fulfilled' ? results[0].value : [],
      categories: results[1].status === 'fulfilled' ? results[1].value : [],
      regions: results[2].status === 'fulfilled' ? results[2].value : [],
    };
  }

  async getBanners() {
    const banners = await this.contentFilterRepository.findByType('BANNER', { isActive: true });

    if (!banners || banners.length === 0) {
      throw new NotFoundError('No active banners found');
    }

    return banners.map((banner) => ({
      id: banner._id.toString(),
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      icon: banner.icon,
    }));
  }

  async getCategoriesWithContents() {
    const categories = await this.contentFilterRepository.findByType('CATEGORY', { isActive: true });

    if (!categories || categories.length === 0) {
      throw new NotFoundError('No active categories found');
    }

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
  }

  async getFilteredContents(filterCondition) {
    if (!filterCondition || this.isEmptyFilterCondition(filterCondition)) {
      return [];
    }

    const filteredResults =
      await this.environmentAggregationRepository.findFilteredContentsWithApiParameters(filterCondition);

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
    const addressGroups = await this.koreanAddressRepository.findGroupByLevel();

    if (!addressGroups || addressGroups.length === 0) {
      throw new NotFoundError('No address data found');
    }

    const sigunguAddresses = addressGroups.find((group) => group._id === 'SIGUNGU')?.addresses;

    if (!sigunguAddresses?.length) {
      return [];
    }

    const districtCodes = sigunguAddresses.map((addr) => addr.id);
    const stats = await this.environmentAggregationRepository.findStatsByAllDistricts(districtCodes);
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
  }
}

module.exports = MainService;
