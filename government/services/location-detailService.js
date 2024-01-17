import District from '../models/districtSchema.js';
import Ward from '../models/wardSchema.js';
import * as districtService from '../services/districtService.js';
import * as wardService from "../services/wardService.js";
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
            districtID: districtID
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
              districtID: districtID
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

export const getDistrictWardName = async (lat, lng) => {
  const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&apiKey=${process.env.REVERSE_GEOCODING_API}&lang=vi`;

  try {
    const res = await fetch(api);
    const data = await res.json();
    let districtName = data.items[0].address.city.replace('Quận ', '').trim();
    let wardName = data.items[0].address.district.replace('Phường ', '').trim();
    if (districtName.length === 1) {
      districtName = districtName;
    }
    if (wardName.length === 1) {
      wardName = '0' + wardName;
    }
    let address = data.items[0].address.label;
    console.log(address);
    address = address.slice(0, address.indexOf(', Phường')).split(',');
    if(address.length == 2){
      address = (address[0] == 'To Go') ? address[1].slice(1) : address.join(',');
    } else {
      address = address[0];
    }
    const check1 = 'Quận ' + districtName;
    const check2 = 'Phường ' + wardName
    const  districtID = (await districtService.getIDByName(check1)) || '';
    // console.log(districtName, districtID);
    const wardID = (await wardService.getIDByName(check2)) || '';
    // console.log(wardName, wardID);

    return { address, districtName, wardName, districtID, wardID };
  } catch (error) {
    throw new Error(`Error getting district and ward name: ${error.message}`);
  }
}
