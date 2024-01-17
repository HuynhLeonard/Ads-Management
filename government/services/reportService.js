import report from '../models/reportAdsSchema.js';

export const createReport = async (reportData) => {
    try {
        const newReport = new report(reportData);
        const count = await report.countDocuments();
        newReport.reportID = 'BC' + String(count + 1).padStart(3, '0');
        console.log(newReport);
        const saveData = await newReport.save();
        return newReport.reportID;
    } catch (error) {
        throw new Error('Error happen when creating report.')
    }
};

export const updateReport = async (reportID, updateData) => {
    try {
        const updatedReport = await report.findOneAndUpdate({ reportID: reportID }, { $set: updateData });

        return { message: 'Report update successfully' };
    } catch (error) {
        throw new Error('Error happened when update report.')
    }
};

export const getAllReport = async () => {
    const option = [
        {
            $lookup: {
                from: "reporttypes",
                localField: "reportType",
                foreignField: "reportTypeID",
                as: "reporttype",
            }
        },
        {
            $unwind: {
                path: "$reporttype",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "locations",
                localField: "objectID",
                foreignField: "locationID",
                as: "locationInfo",
            }
        },
        {
            $lookup: {
                from: "boards",
                localField: "objectID",
                foreignField: "boardID",
                as: "board",
            }
        },
        {
            $unwind: {
                path: "$board",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "locations",
                localField: "board.locationID",
                foreignField: "locationID",
                as: "location",
            }
        },
        {
            $unwind: {
                path: "$location",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                reportID: 1,
                objectID: 1,
                reportType: 1,
                reportTypeName: "$reporttype.reportTypeName",
                reporterName: 1,
                sendTime: 1,
                status: 1,
                LocationDistrictID: {
                    $cond: {
                        if: { $eq: ['$location', []] },
                        then: '$locationInfo.districtID',
                        else: '$location.districtID'
                    }
                },
                LocationWardID: {
                    $cond: {
                        if: { $eq: ['$location', []] },
                        then: '$locationInfo.wardID',
                        else: '$location.wardID'
                    }
                },
            }
        },
        {
            $lookup: {
                from: "districts",
                localField: "location.districtID",
                foreignField: "districtID",
                as: "district",
            }
        },
        {
            $unwind: {
                path: "$district",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "wards",
                localField: "location.wardID",
                foreignField: "wardID",
                as: "ward",
            }
        },
        {
            $unwind: {
                path: "$ward",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $project: {
                _id: 0,
                reportID: 1,
                objectID: 1,
                reportType: 1,
                reporterName: 1,
                sendTime: 1,
                status: 1,
                reportTypeName: "$reporttype.reportTypeName",
                locationDistrictName: "$district.districtName",
                locationWardName: "$ward.wardName",
            }
        }
    ];
    try {
        const reports = await report.aggregate(option);
        return reports;
    } catch (error) {
        console.log(error);
        throw new Error('Error happened when getting all report.');
    }
};

// query
export const getSingleReport = async (reportID) => {
    const option = [
        {
            $match: {
                reportID: reportID,
            }
        },
        {
            $lookup: {
                from: "reporttypes",
                localField: "reportType",
                foreignField: "reportTypeID",
                as: "reporttype",
            }
        },
        {
            $unwind: {
                path: "$reporttype",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "officer",
                foreignField: "username",
                as: "user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "districts",
                localField: "user.districtID",
                foreignField: "districtID",
                as: "district",
            }
        },
        {
            $unwind: {
                path: "$district",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "wards",
                localField: "user.wardID",
                foreignField: "wardID",
                as: "ward",
            }
        },
        {
            $unwind: {
                path: "$ward",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                reportID: 1,
                objectID: 1,
                reportType: '$reporttype.reportTypeName',
                reporterName: 1,
                reporterEmail: 1,
                phoneNumber: 1,
                sendTime: 1,
                status: 1,
                reportInfo: 1,
                solution: 1,
                reportImages: 1,
                officer: 1,
                userDistrictName: "$district.districtName",
                userWardName: "$ward.wardName",
            }
        },
        {
            $limit: 1
        }
    ];
    try {
        const reports = await report.aggregate(option);
        return reports;
    } catch (error) {
        throw new Error('Error happened when getting single report.');
    }
};

export const getReportsByObjectID = async (objectID) => {
    const option = [
        {
            $match: {
                objectID: objectID,
            }
        },
        {
            $lookup: {
                from: "boards",
                localField: "objectID",
                foreignField: "boardID",
                as: "board",
            }
        },
        {
            $unwind: {
                path: "$board",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "locations",
                localField: "board.locationID",
                foreignField: "locationID",
                as: "location",
            }
        },
        {
            $unwind: {
                path: "$location",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "districts",
                localField: "location.districtID",
                foreignField: "districtID",
                as: "district",
            }
        },
        {
            $unwind: {
                path: "$district",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "wards",
                localField: "location.wardID",
                foreignField: "wardID",
                as: "ward",
            }
        },
        {
            $unwind: {
                path: "$ward",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                reportID: 1,
                objectID: 1,
                reportType: 1,
                reporterName: 1,
                sendTime: 1,
                status: 1,
                locationDistrictName: "$district.districtName",
                locationWardName: "$ward.wardName",
            }
        },
    ];
    try {
        const reports = await report.aggregate(option);
        return reports;
    } catch (error) {
        throw new Error('Error happened when getting report by object.');
    }
};

export const getReportByOfficerRole = async (officerRole) => {
    try {
        const reports = await report.aggregate([
            {
                $lookup: {
                    from: 'locations',
                    localField: 'objectID',
                    foreignField: 'locationID',
                    as: 'locationInfo'
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
                    as: 'boardLocationInfo'
                }
            },
            {
                $match: {
                    $or: [
                        { 'locationInfo.districtID': officerRole },
                        { 'locationInfo.wardID': officerRole },
                        { 'boardLocationInfo.districtID': officerRole },
                        { 'boardLocationInfo.wardID': officerRole },
                        { 'objectID': { $regex: '^AD' } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'reporttypes',
                    localField: 'reportType',
                    foreignField: 'reportTypeID',
                    as: 'htbc'
                }
            },
            {
                $unwind: {
                    path: '$htbc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    reportID: 1,
                    objectID: 1,
                    reportType: '$htbc.reportTypeName',
                    reporterName: 1,
                    reporterEmail: 1,
                    sendTime: 1,
                    status: 1,
                    // test1: {$arrayElemAt: ['$spotInfo.spotID', 0]},
                    // test2: '$objectID',
                    wardID: {
                        $cond: {
                            if: { $eq: ['$objectID', { $arrayElemAt: ['$locationInfo.locationID', 0] }] },
                            then: '$locationInfo.wardID',
                            else: {
                                $cond: {
                                    if: { $eq: ['$objectID', '$boardInfo.boardID'] },
                                    then: '$boardLocationInfo.wardID',
                                    else: null,
                                }
                            },
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'wards',
                    localField: 'wardID',
                    foreignField: 'wardID',
                    as: 'wardInfo'
                }
            },
            {
                $unwind: {
                    path: '$wardInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    reportID: 1,
                    objectID: 1,
                    reportType: 1,
                    reporterName: 1,
                    reporterEmail: 1,
                    sendTime: 1,
                    status: 1,
                    wardName: '$wardInfo.wardName'
                }
            }
        ]);

        return reports;
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
};

export const getReportsByType = async (reportType) => {
    const option = [
        {
            $match: {
                reportType: reportType,
            }
        },
        {
            $lookup: {
                from: "boards",
                localField: "objectID",
                foreignField: "boardID",
                as: "board",
            }
        },
        {
            $unwind: {
                path: "$board",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "locations",
                localField: "board.locationID",
                foreignField: "locationID",
                as: "location",
            }
        },
        {
            $unwind: {
                path: "$location",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "districts",
                localField: "location.districtID",
                foreignField: "districtID",
                as: "district",
            }
        },
        {
            $unwind: {
                path: "$district",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "wards",
                localField: "location.wardID",
                foreignField: "wardID",
                as: "ward",
            }
        },
        {
            $unwind: {
                path: "$ward",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "reporttypes",
                localField: "reportType",
                foreignField: "reportTypeID",
                as: "reporttype",
            }
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
                objectID: 1,
                reportType: 1,
                reporterName: 1,
                sendTime: 1,
                status: 1,
                reportTypeName: "$reporttype.reportTypeName",
                locationDistrictName: "$district.districtName",
                locationWardName: "$ward.wardName",
            }
        },
    ];
    try {
        const reports = await report.aggregate(option);
        return reports;
    } catch (error) {
        throw new Error('Error happened when getting report by type.');
    }
};

export const getReportsWithDistrictID = async () => {
    try {
        const options = [
            {
                $lookup: {
                    from: 'locations',
                    localField: 'objectID',
                    foreignField: 'locationID',
                    as: 'locationInfo'
                }
            },
            {
                $unwind: {
                    path: '$locationInfo',
                    preserveNullAndEmptyArrays: true
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
                    as: 'boardLocationInfo'
                }
            },
            {
                $lookup: {
                    from: 'reporttypes',
                    localField: 'reportType',
                    foreignField: 'reportTypeID',
                    as: 'htbc'
                }
            },
            {
                $unwind: {
                    path: '$htbc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    reportID: 1,
                    objectID: 1,
                    reportTypeName: '$htbc.reportTypeName',
                    reporterName: 1,
                    reporterEmail: 1,
                    sendTime: 1,
                    status: 1,
                    // test1: {$arrayElemAt: ['$spotInfo.spotID', 0]},
                    // test2: '$objectID',
                    districtID: {
                        $cond: {
                            if: { $eq: ['$objectID', '$locationInfo.locationID'] },
                            then: '$locationInfo.districtID',
                            else: {
                                $cond: {
                                    if: { $eq: ['$objectID', '$boardInfo.boardID'] },
                                    then: '$boardLocatioInfo.districtID',
                                    else: null,
                                }
                            },
                        }
                    },
                    isSpot: {
                        $cond: {
                            if: { $eq: ['$objectID', '$locationInfo.locationID'] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'districts',
                    localField: 'districtID',
                    foreignField: 'districtID',
                    as: 'reportDistrictInfo'
                }
            },
            {
                $unwind: {
                    path: '$reportDistrictInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    reportID: 1,
                    objectID: 1,
                    reportType: 1,
                    reporterName: 1,
                    reporterEmail: 1,
                    sendTime: 1,
                    status: 1,
                    districtName: '$reportDistrictInfo.districtName',
                    isSpot: 1
                }
            }
        ]
        const reports = await report.aggregate(options);
        return reports;
    } catch (error) {
        throw new Error(`Error getting all reports: ${error.message}`);
    }
};


export const basicCountReports = async () => {
    const totalReports = await report.countDocuments();
    const handledReports = await report.countDocuments({ status: 1 });
    const notHandledReports = await report.countDocuments({ status: 0 });

    return { totalReports, handledReports, notHandledReports };
}

export const getReportTypeCounts = async () => {
    try {
        const reportTypeCounts = await report.aggregate([
            {
                $lookup: {
                    from: 'reporttypes', // Assuming the name of your reporttypes collection
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
                $project: {
                    _id: 0,
                    typeName: '$reportType.reportTypeName',
                }
            },
            {
                $group: {
                    _id: '$typeName',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    typeName: 1,
                    count: 1,
                }
            },
        ]);

        return reportTypeCounts;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const getReportCountsDistrict = async () => {
    try {
        let currentDate = new Date();
        currentDate = currentDate.setMonth(currentDate.getMonth() - 3)
        const startDate = new Date(currentDate);
        console.log(startDate);
        const reportDistrictCounts = await report.aggregate([
            {
                $match: {
                    sendTime: { $gte: startDate } // Filter reports within the last 3 months
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'objectID',
                    foreignField: 'locationID',
                    as: 'locationInfo'
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
                    as: 'boardLocationInfo'
                }
            },
            {
                $project: {
                    _id: 0,
                    locationDistrictID: {
                        $cond: {
                            if: { $eq: ['$boardLocationInfo', []] },
                            then: '$locationInfo.districtID',
                            else: '$boardSpotInfo.districtID'
                        }
                    },
                }
            },
            {
                $group: {
                    _id: '$locationDistrictID',
                    count: { $sum: 1 },
                }
            },
            {
                $project: {
                    districtID: '$locationDistrictID',
                    count: 1,
                }
            }
        ]);

        return reportDistrictCounts;
    } catch (error) {
        console.error('Error:', error);
    }
}


export const getReportCountsByObjectType = async () => {
    try {
        const reportCounts = await report.aggregate([
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $regexMatch: { input: '$objectID', regex: /^QC\d{4}$/ } },
                            then: 'board',
                            else: 'location'
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        return reportCounts;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const getReportsByStatus = async (status) => {
    const option = [
        {
            $match: {
                status: Number(status),
            }
        },
        {
            $lookup: {
                from: "boards",
                localField: "objectID",
                foreignField: "boardID",
                as: "board",
            }
        },
        {
            $unwind: {
                path: "$board",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "locations",
                localField: "board.locationID",
                foreignField: "locationID",
                as: "location",
            }
        },
        {
            $unwind: {
                path: "$location",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "districts",
                localField: "location.districtID",
                foreignField: "districtID",
                as: "district",
            }
        },
        {
            $unwind: {
                path: "$district",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "wards",
                localField: "location.wardID",
                foreignField: "wardID",
                as: "ward",
            }
        },
        {
            $unwind: {
                path: "$ward",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "reporttypes",
                localField: "reportType",
                foreignField: "reportTypeID",
                as: "reporttype",
            }
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
                objectID: 1,
                reportType: 1,
                reporterName: 1,
                sendTime: 1,
                status: 1,
                reportTypeName: "$reporttype.reportTypeName",
                locationDistrictName: "$district.districtName",
                locationWardName: "$ward.wardName",
            }
        },
    ];
    try {
        const reports = await report.aggregate(option);
        return reports;
    } catch (error) {
        throw new Error('Error happened when getting report by status.');
    }
}

export const deleteReport = async (reportID) => {
    try {
        await report.findOneAndDelete({ reportID: reportID });
        return { message: 'Delete successful.' };
    } catch (error) {
        throw new Error('Error happened when delete report.');
    }
};