import reportTypes from '../models/reportTypeSchema.js';

export const createReportType = async (reportTypeData) => {
    try {
        const newReport = new reportTypes(reportTypeData);
        // const count = await reportTypes.countDocuments();
        // newReport.reportTypeID = 'HT-BC' + String(count + 1).padStart(3,'0');
        return await newReport.save();

    } catch (error) {
        throw new Error('Error happen when creating report type.')
    }
};

export const updateReportType = async (reportTypeID,updateData) => {
    try {
        await reportTypes.findOneAndUpdate({reportTypeID: reportTypeID}, {$set: updateData});
        return {message: 'Report update successfully'};
    } catch (error) {
        throw new Error('Error happened when update report.')
    }
};

export const getAllReportType = async () => {
    try {
        return await reportTypes.find();
    } catch (error) {
        throw new Error('Error happened when getting all report type.');
    }
};

export const getSingleReportType = async (reportTypeID) => {
    try {
        const reportType = await reportTypes.find({reportTypeID: reportTypeID});
        return reportType;
    } catch (error) {
        throw new Error('Error');
    }
};


export const deleteReportType = async (reportTypeID) => {
    try {
        await reportTypes.findOneAndDelete({reportTypeID: reportTypeID});
        return { message: 'Delete successful.' };
    } catch (error) {
        throw new Error('Error happened when delete report type.');
    }
};