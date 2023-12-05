import reportTypes from '../models/reportTypeSchema.js';

export const createReportType = async (reportTypeData) => {
    try {
        const newReport = new reportTypes(reportTypeData);
        const count = await reportTypes.countDocuments();
        newReport.reportTypeID = 'LH-BC' + String(count + 1).padStart(3,'0');
        const saveData = await newReport.save();
        return saveData;
    } catch (error) {
        throw new Error('Error happen when creating report type.')
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