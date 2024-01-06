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
        const report = await report.aggregate(option);
        console.log(report);
        return report;
    } catch (error) {
        throw new Error('Error happened when getting all report.');
    }
};

// query
export const getSingleReport = async (reportID) => {
    try {
        const report = await report.find({reportID: reportID});
        return report;
    } catch (error) {
        throw new Error('Error');
    }
};

export const getReportsByObjectID = async (objectID) => {

};

export const getReportsByType = async (reportType) => {

};

export const getReportsByStatus = async (status) => {

}

export const deleteReport = async (reportID) => {
    try {
        await report.findOneAndDelete({reportID: reportID});
        return { message: 'Delete successful.' };
    } catch (error) {
        throw new Error('Error happened when delete report.');
    }
};