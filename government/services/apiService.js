import Location from "../models/locationSchema.js";
import Report from "../models/reportAdsSchema.js";
import {createReport,getSingleReport} from "./reportService.js"
import {getSingleBoard} from "./boardService.js";
import {getAllReportType} from "./reportTypeService.js";
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

export const getLocationDetail = async (locationID, getAll) => {
    let currentDate = new Date();
    if (getAll == true) {
        currentDate.setFullYear(currentDate.getFullYear() - 10);
    }
    const option = [
        {
            $match: {
                locationID: locationID
            }
        },
        {
            $lookup: {
                from: 'boards',
                localField: 'locationID',
                foreignField: 'locationID',
                as: 'boards',
                pipeline: [
                    {
                        // report of board
                        $lookup: {
                            from: 'reports',
                            localField: 'boardID',
                            foreignField: 'objectID',
                            as: 'reports',
                            pipeline: [
                                {
                                    $lookup: {
                                        from: 'reporttypes',
                                        localField:'reportType',
                                        foreignField:'reportTypeID',
                                        as: 'reporttype'
                                    },
                                },
                                {
                                    $unwind: {
                                        path: "$reporttype",
                                        preserveNullAndEmptyArrays: true
                                    }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        reportID: 1,
                                        reporterName: 1,
                                        sendTime: 1,
                                        status: 1,
                                        reportType: '$reporttype.reportTypeName'
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            as: 'boardtype',
                            from: 'boardtypes',
                            foreignField: 'typeID',
                            localField: 'boardType'
                        }
                    },
                    {
                        $unwind: {
                            path: '$boardtype',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            boardID: 1,
                            reports: 1,
                            boardSize: { $concat: [{ $toString: '$width' }, 'x', { $toString: '$height' }] },
                            quantity: 1,
                            boardType: '$boardtype.typeName'
                        }
                    },
                    {
                        $match: {
                            expiredDate: {$gt: currentDate}
                        }
                    }
                ]
            }
        },
        {
            // report of place
            $lookup: {
                as: 'reports',
                from: 'reports',
                foreignField: 'objectID',
                localField: 'locationID',
                pipeline: [
                    {
                        $lookup: {
                            as: 'reporttype',
                            from: 'reporttypes',
                            foreignField: 'reportTypeID',
                            localField: 'reportType'
                        }
                    },
                    {
                        $unwind: {
                            path: '$reporttype',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            reportID: 1,
                            reporterName: 1,
                            sendTime: 1,
                            status: 1,
                            reportType: '$reporttype.reportTypeName'
                        }
                    }
                ]
            }
        },
        {
            // look for ward
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
            // district
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
            // locationType
            $lookup: {
                from: 'locationtypes',
                localField: 'locationType',
                foreignField: 'locationTypeID',
                as: 'locationtype'
            }
        },
        {
            // adsCategory
            $lookup: {
                from: 'adscategories',
                localField: 'adsForm',
                foreignField: 'CategoriesID',
                as: 'adsforms'
            }
        },
        {
            $unwind: {
                path: "$district",
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
                path: '$locationtype',
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
                Images: 1,
                address: {
                    $concat: ['$address', ', Phường ', '$ward.wardName', ', Quận ', '$district.districtName']
                },
                adsFormNme: '$adsforms.CategoriesName',
                locationTypeName: '$locationtype.locationTypeName',
                planned: {
                    $cond: {
                        if: {
                            $eq: ['$planned', 1]
                        },
                        then: 'Đã quy hoạch',
                        else: 'Chưa quy hoạch'
                    }
                },
                reports: 1,
                boards: 1
            }
        }
    ]
    try {
        return await Location.aggregate(option);
    } catch (error) {
        throw new Error('Error getting details of location.')
    }
};

// get all/single report
export const getListReport = async (reportIDs) => {
    try {
        reportIDs = reportIDs.split(',');
        const option = [
            {
                $match: {
                    reportID: { $in: reportIDs }
                }
            },
            {
                $lookup: {
                    from: 'reporttypes',
                    localField: 'reportType',
                    foreignField: 'reportTypeID',
                    as: 'reportType'
                }
            },
            {
                $unwind: {
                    path: '$reportType',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'objectID',
                    foreignField: 'locationID',
                    as: 'spotInfo'
                }
            },
            {
                $lookup: {
                    from: 'boards',
                    localField: 'objectID',
                    foreignField: 'boardID',
                    as: 'boardInfo'
                }
            },
            {
                $unwind: {
                    path: '$boardInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'boardInfo.locationID',
                    foreignField: 'locationID',
                    as: 'boardSpotInfo'
                }
            },
            {
                $project: {
                    _id: 0,
                    reportID: 1,
                    objectID: 1,
                    reportType: '$reportType.reportTypeName',
                    reporterName: 1,
                    sendTime: 1,
                    status: 1,
                    spotDistrictID: {
                    $cond: {
                        if: { $eq: ['$boardSpotInfo', []] },
                        then: '$spotInfo.districtID',
                        else: '$boardSpotInfo.districtID'
                    }
                },
                spotWardID: {
                    $cond: {
                        if: { $eq: ['$boardSpotInfo', []] },
                        then: '$spotInfo.wardID',
                        else: '$boardSpotInfo.wardID'
                    }
                },
              }
            },
            {
              $lookup: {
                from: 'districts',
                localField: 'spotDistrictID',
                foreignField: 'districtID',
                as: 'spotDistrict'
              }
            },
            {
              $lookup: {
                from: 'wards',
                localField: 'spotWardID',
                foreignField: 'wardID',
                as: 'spotWard'
              }
            },
            {
              $unwind: {
                path: '$spotDistrict',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $unwind: {
                path: '$spotWard',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                reportID: 1,
                objectID: 1,
                reportType: 1,
                reporterName: 1,
                sendTime: 1,
                status: 1,
                spotDistrictName: '$spotDistrict.districtName',
                spotWardName: '$spotWard.wardName'
              }
            }
        ]
    } catch (error) {
        console.log(error);
        throw new Error(`Error getting list report: ${error.message}`);
    }
};

export default {
    createReport,
    getAllReportType,
    getAllLocations,
    getSingleBoard,
    getLocationDetail,
    getListReport,
    getSingleReport
}