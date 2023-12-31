import Location from "../models/locationSchema.js";
import Report from "../models/reportAdsSchema.js";

// query here

export const getAllLocations = async (districtID, wardID) => {
    const option = [
        {
            $match: {
                districtID: districtID || {$exists: true},
                wardID: wardID || {$exists: true}
            }
        },
        {
            $lookup: {
                as: 'boards',
                from: 'boards',
                foreignField: 'locationID',
                localField: 'locationID',
                pipeline: [
                    {
                    $lookup: {
                        as: 'reports',
                        from: 'reports',
                        foreignField: 'boardID',
                        localField: 'boardID'
                    }
                    },
                    {
                    $project: {
                        _id: 0,
                        boardID: 1,
                        reports: {
                        $size: '$reports'
                        }
                    }
                    }
                ]
                }
            },
            {
                $lookup: {
                as: 'reports',
                from: 'reports',
                foreignField: 'boardID',
                localField: 'locationID'
                }
            },
            {
                // lookup district
                $lookup: {
                from: 'districts',
                localField: 'districtID',
                foreignField: 'districtID',
                as: 'district',
                pipeline: [
                    {
                    $project: {
                        _id: 0,
                        districtID: 1,
                        districtName: 1
                    }
                    }
                ]
                }
            },
            {
                // lookup ward
                $lookup: {
                from: 'wards',
                localField: 'wardID',
                foreignField: 'wardID',
                as: 'ward',
                pipeline: [
                    {
                    $project: {
                        _id: 0,
                        wardID: 1,
                        wardName: 1
                    }
                    }
                ]
                }
            },
            {
                // lookup spot type
                $lookup: {
                from: 'locationtypes',
                localField: 'locationType',
                foreignField: 'locationTypeID',
                as: 'spottypes'
                }
            },
            {
                // lookup ads form
                $lookup: {
                from: 'adscategories',
                localField: 'adsForm',
                foreignField: 'CategoriesID',
                as: 'adsforms'
                }
            },
            {
                $unwind: {
                path: '$district',
                preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                path: '$ward',
                preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                path: '$spottypes',
                preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                path: '$adsforms',
                preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                _id: 0,
                locationID: 1,
                locationName: 1,
                latitude: 1,
                longitude: 1,
                images: 1,
                address: {
                    $concat: ['$address', ', Phường ', '$ward.wardName', ', Quận ', '$district.districtName']
                },
                adsFormName: '$adsforms.CategoriesName',
                locationTypeName: '$spottypes.locationTypeName',
                planned: {
                    $cond: {
                    if: {
                        $eq: ['$planned', 1]
                    },
                    then: 'Đã quy hoạch',
                    else: 'Chưa quy hoạch'
                    }
                },
                hasReport: {
                    $cond: {
                    if: {
                        $gte: [{ $sum: [{ $size: '$reports' }, { $sum: '$boards.reports' }] }, 1]
                    },
                    then: true,
                    else: false
                    }
                },
                hasAds: {
                    $cond: {
                    if: { $eq: [{ $size: '$boards' }, 0] },
                    then: false,
                    else: true
                    }
                }
                }
            },
            {
                $sort: {
                spotID: 1
                }
            }
    ]
    return await Location.aggregate(option);
};

const getLocationDetail = async (locationID) => {

};

const getListReport = async () => {

};