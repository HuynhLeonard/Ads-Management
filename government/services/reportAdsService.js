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
    try {
        const report = await report.find();
        return report;
    } catch (error) {
        throw new Error('Error happened when getting all report type.');
    }
};

export const getSingleReport = async (reportID) => {
    try {
        const report = await report.find({reportID: reportID});
        return report;
    } catch (error) {
        throw new Error('Error');
    }
};

export const deleteReport = async (reportID) => {
    try {
        await report.findOneAndDelete({reportID: reportID});
        return { message: 'Delete successful.' };
    } catch (error) {
        throw new Error('Error happened when delete report.');
    }
};