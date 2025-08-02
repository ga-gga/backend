const Environment = require('../models/environment');
const DatabaseError = require('../errors/DatabaseError');
const NotFoundError = require('../errors/NotFoundError');

class EnvironmentRepository {
  async save(environmentData) {
    const environment = new Environment(environmentData);
    return await environment.save();
  }

  async findAll() {
    return await Environment.find();
  }

  async findFilteredContentsWithApiParameters(filterCondition) {
    try {
      const currentTime = new Date();

      const result = await Environment.aggregate([
        {
          $match: {
            'dataStatus.isComplete': true,
          },
        },
        {
          $sort: {
            apiParameterId: 1,
            dataCollectedAt: -1,
          },
        },
        {
          $group: {
            _id: '$apiParameterId',
            latestData: { $first: '$$ROOT' },
          },
        },
        {
          $addFields: {
            currentSkyStatus: {
              $let: {
                vars: {
                  closestForecast: {
                    $arrayElemAt: [
                      {
                        $sortArray: {
                          input: {
                            $map: {
                              input: '$latestData.weatherForecast',
                              as: 'forecast',
                              in: {
                                skyStatus: '$$forecast.skyStatus',
                                timeDiff: {
                                  $abs: {
                                    $subtract: ['$$forecast.forecastTime', currentTime],
                                  },
                                },
                              },
                            },
                          },
                          sortBy: { timeDiff: 1 },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: '$$closestForecast.skyStatus',
              },
            },
          },
        },
        {
          $match: {
            $and: [
              ...(filterCondition.congestion && filterCondition.congestion.length > 0
                ? [
                    {
                      'latestData.population.congestionLevel': {
                        $in: filterCondition.congestion,
                      },
                    },
                  ]
                : []),
              ...(filterCondition.temperature ? [this.buildTemperatureCondition(filterCondition.temperature)] : []),
              ...(filterCondition.skyStatus && filterCondition.skyStatus.length > 0
                ? [
                    {
                      currentSkyStatus: {
                        $in: filterCondition.skyStatus,
                      },
                    },
                  ]
                : []),
            ].filter((condition) => Object.keys(condition).length > 0),
          },
        },
        {
          $lookup: {
            from: 'apiparameters',
            let: { paramId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$paramId'] },
                  isActive: true,
                },
              },
            ],
            as: 'apiParameter',
          },
        },
        {
          $match: {
            'apiParameter.0': { $exists: true },
          },
        },
        {
          $project: {
            apiParameter: { $arrayElemAt: ['$apiParameter', 0] },
            environmentData: '$latestData',
            currentSkyStatus: 1,
          },
        },
      ]);

      if (!result) {
        throw new NotFoundError('No filtered content data found');
      }

      return result;
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to find filtered contents with api parameters: ${error.message}`);
    }
  }

  buildTemperatureCondition(temperatureFilter) {
    const tempConditions = {};

    if (temperatureFilter.min !== undefined) {
      tempConditions.$gte = temperatureFilter.min;
    }

    if (temperatureFilter.max !== undefined) {
      tempConditions.$lte = temperatureFilter.max;
    }

    return Object.keys(tempConditions).length > 0 ? { 'latestData.weather.temperature': tempConditions } : {};
  }

  async findStatsByAllDistricts(allDistrictCodes) {
    try {
      const currentTime = new Date();

      const result = await Environment.aggregate([
        {
          $lookup: {
            from: 'apiparameters',
            localField: 'apiParameterId',
            foreignField: '_id',
            as: 'apiParameter',
          },
        },
        {
          $unwind: '$apiParameter',
        },
        {
          $match: {
            'apiParameter.isActive': true,
            'dataStatus.isComplete': true,
          },
        },
        {
          $unwind: '$apiParameter.koreanAddressCodes',
        },
        {
          $lookup: {
            from: 'koreanaddresses',
            let: { dongCode: '$apiParameter.koreanAddressCodes' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$dongCode'] },
                  level: 'EUPMYEONDONG',
                  parentCode: { $in: allDistrictCodes },
                },
              },
            ],
            as: 'dongInfo',
          },
        },
        {
          $match: {
            'dongInfo.0': { $exists: true },
          },
        },
        {
          $unwind: '$dongInfo',
        },
        {
          $sort: { dataCollectedAt: -1 },
        },
        {
          $group: {
            _id: '$dongInfo.parentCode',
            avgTemperature: { $avg: '$weather.temperature' },
            minTemperature: { $min: '$weather.minTemperature' },
            maxTemperature: { $max: '$weather.maxTemperature' },
            congestionLevels: { $push: '$population.congestionLevel' },
            currentSkyStatuses: {
              $push: {
                $let: {
                  vars: {
                    closestForecast: {
                      $arrayElemAt: [
                        {
                          $sortArray: {
                            input: {
                              $map: {
                                input: '$weatherForecast',
                                as: 'forecast',
                                in: {
                                  skyStatus: '$$forecast.skyStatus',
                                  timeDiff: {
                                    $abs: {
                                      $subtract: ['$$forecast.forecastTime', currentTime],
                                    },
                                  },
                                },
                              },
                            },
                            sortBy: { timeDiff: 1 },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: '$$closestForecast.skyStatus',
                },
              },
            },
          },
        },
        {
          $addFields: {
            mostFrequentCongestion: {
              $arrayElemAt: [
                {
                  $map: {
                    input: {
                      $sortArray: {
                        input: {
                          $map: {
                            input: {
                              $setUnion: ['$congestionLevels', []],
                            },
                            as: 'level',
                            in: {
                              level: '$$level',
                              count: {
                                $size: {
                                  $filter: {
                                    input: '$congestionLevels',
                                    cond: { $eq: ['$$this', '$$level'] },
                                  },
                                },
                              },
                            },
                          },
                        },
                        sortBy: { count: -1 },
                      },
                    },
                    as: 'item',
                    in: '$$item.level',
                  },
                },
                0,
              ],
            },
            currentSkyStatus: {
              $arrayElemAt: [
                {
                  $map: {
                    input: {
                      $sortArray: {
                        input: {
                          $map: {
                            input: {
                              $setUnion: ['$currentSkyStatuses', []],
                            },
                            as: 'status',
                            in: {
                              status: '$$status',
                              count: {
                                $size: {
                                  $filter: {
                                    input: '$currentSkyStatuses',
                                    cond: { $eq: ['$$this', '$$status'] },
                                  },
                                },
                              },
                            },
                          },
                        },
                        sortBy: { count: -1 },
                      },
                    },
                    as: 'item',
                    in: '$$item.status',
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
            avgTemperature: 1,
            minTemperature: 1,
            maxTemperature: 1,
            mostFrequentCongestion: 1,
            currentSkyStatus: 1,
          },
        },
      ]);

      if (!result) {
        throw new NotFoundError('No environment statistics found');
      }

      return result;
    } catch (error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        throw new DatabaseError('Database connection failed');
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to find environment stats: ${error.message}`);
    }
  }
}

module.exports = EnvironmentRepository;
