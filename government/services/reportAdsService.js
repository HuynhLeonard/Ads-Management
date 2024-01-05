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
            $project: {
                reportID: 1,
                objectID: 1,
                reportType: 1,
                reporterName: 1,
                sendTime: 1,
                status: 1,
                locationDistrictName: '$',
                locationWardName: '$',
            }
        }
    ]
    try {
        const report = await report.aggregate(option);
        return report;
    } catch (error) {
        throw new Error('Error happened when getting all report type.');
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