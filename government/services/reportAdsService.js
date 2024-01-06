import report from '../models/reportAdsSchema.js';

export const createReport = async (reportData) => {
    try {
        const newReport = new report(reportData);
        const count = await report.countDocuments();
        newReport.reportID = 'BC' + String(count + 1).padStart(3,'0');
        const saveData = await newReport.save();
        return saveData;
    } catch (error) {
        throw new Error('Error happen when creating report.')
    }
};

export const updateReport = async (reportID,updateData) => {
    try {
        const updatedReport = await report.findOneAndUpdate({reportID: reportID}, {$set: updateData});
        
        return {message: 'Report update successfully'};
    } catch (error) {
        throw new Error('Error happened when update report.')
    }
};

export const getAllReport = async () => {
    const option = [
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
        await report.findOneAndDelete({reportID: reportID});
        return { message: 'Delete successful.' };
    } catch (error) {
        throw new Error('Error happened when delete report.');
    }
};