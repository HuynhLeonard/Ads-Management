import District from '../models/districtSchema.js';
import Ward from '../models/wardSchema.js';

export const getAll = async ()=> {
    const option = [
        {
            $lookup: {
                from: 'wards',
                localField: 'districtID',
                foreignField: 'districtID',
                as: 'wards'
            },
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'districtID',
                foreignField: 'districtID',
                as: 'locations'
            }
        },
        {
            $lookup: {
                from: 'boards',
                localField: 'locations.locationID',
                foreignField: 'locationID',
                as: 'boards'
            }
        },
        {
            $project: {
                _id: 0,
                districtID: 1,
                districtName: 1,
                wardsCount: {$size: '$wards'},
                locationsCount: {$size: '$locations'},
                boardsCount: {$size: '$boards'}
            }
        },
        {
            $sort: {
                districtID: 1
            }
        }
    ]
    try {
        const districts = await District.aggregate(option);
        return districts;
    } catch (error) {
        throw new Error('Error when getting all location detail.')
    }
};

// get ward detais
export const getDetails = async (districtID) => {
    const option = [
        {
          $match: {
            districtID: 'Q001'
          }
        },
        {
          $lookup: {
            from: 'locations',
            localField: 'wardID',
            foreignField: 'wardID',
            as: 'locations',
          }
        },
        {
          $lookup: {
            from: 'boards',
            localField: 'locations.locationID',
            foreignField: 'locationID',
            as: 'boards',
          }
        },
        {
          $project: {
            _id: 0,
            wardID: 1,
            wardName: 1,
            spotsCount: { $size: '$locations' },
            boardsCount: { $size: '$boards' },
          }
        },
        {
          $sort: {
            wardName: 1
          }
        }
      ];
    try {
        const wards = await Ward.aggregate(option);
        return wards;
    } catch (error) {
        throw new Error('Error getting district detail.')
    }
};

export const getDistrictDetail = async (districtID) => {
    const option = [
        {
            $match: {
              districtID: 'Q001'
            }
          },
          {
            $lookup: {
              from: 'wards',
              localField: 'districtID',
              foreignField: 'districtID',
              as: 'wards',
            }
          },
          {
            $lookup: {
              from: 'locations',
              localField: 'districtID',
              foreignField: 'districtID',
              as: 'locations',
            }
          },
          {
            $lookup: {
              from: 'boards',
              localField: 'locations.locationID',
              foreignField: 'locationID',
              as: 'boards',
            }
          },
          {
            $project: {
              _id: 0,
              districtID: 1,
              districtName: 1,
              wardsCount: { $size: '$wards' },
              spotsCount: { $size: '$locations' },
              boardsCount: { $size: '$boards' },
            }
          }
    ];
    try {
        const districts = await District.aggregate(option);
        return districts;
    } catch (error) {
        throw new Error('Error getting all districts.')
    }
}