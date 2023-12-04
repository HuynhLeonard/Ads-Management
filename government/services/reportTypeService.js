import reportTypes from '../models/reportTypeSchema.js';

export const createReportType = async (reportTypeData) => {
    try {
        const newReport = new reportTypes(reportTypeData);
        console.log(newReport);
        const saveData = await newReport.save();
        console.log(saveData);
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