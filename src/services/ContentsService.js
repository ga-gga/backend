const ContentFilterRepository = require('../repositories/ContentFilterRepository');
const EnvironmentAggregationRepository = require('../repositories/EnvironmentAggregationRepository');
const KoreanAddressRepository = require('../repositories/KoreanAddressRepository');
const NotFoundError = require('../errors/NotFoundError');

class ContentsService {
  constructor() {
    this.contentFilterRepository = new ContentFilterRepository();
    this.environmentAggregationRepository = new EnvironmentAggregationRepository();
    this.koreanAddressRepository = new KoreanAddressRepository();
  }

  async getContentsByTypeAndId(type, id) {
    if (!type || !id) {
      throw new NotFoundError('Type and ID are required');
    }

    if (type === 'banner') {
      return await this.getContentsByBanner(id);
    } else if (type === 'region') {
      return await this.getContentsByRegion(id);
    } else {
      throw new NotFoundError('Invalid type. Must be "banner" or "region"');
    }
  }

  async getContentsByBanner(bannerId) {
    const banner = await this.contentFilterRepository.findById(bannerId);
    if (!banner) {
      throw new NotFoundError('Banner not found');
    }

    if (!banner.isActive) {
      throw new NotFoundError('Banner is not active');
    }

    const contents = await this.getFilteredContents(banner.filterCondition);

    return {
      categoryType: 'banner',
      title: banner.title,
      regionCode: null,
      contents,
    };
  }

  async getContentsByRegion(regionCode) {
    const region = await this.findRegionByCode(regionCode);
    if (!region) {
      throw new NotFoundError('Region not found');
    }

    const contents = await this.getContentsByRegionCode(regionCode);

    return {
      categoryType: 'region',
      title: `${region.name}`,
      regionCode: regionCode,
      contents,
    };
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

  async getContentsByRegionCode(regionCode) {
    const currentTime = new Date();

    const result = await this.environmentAggregationRepository.findContentsByRegion(regionCode, currentTime);

    return result.map((item) => ({
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

  async findRegionByCode(regionCode) {
    try {
      const result = await this.koreanAddressRepository.findByCode(regionCode);
      return result;
    } catch (error) {
      throw new NotFoundError(`Failed to find region: ${error.message}`);
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
}

module.exports = ContentsService;
