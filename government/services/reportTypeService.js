import reportTypes from '../models/reportTypeSchema.js';

export const createReportType = async (req, res, next) => {
    try {
        const data = req.body;
        const newReport = new reportTypes(data);
        await newReport.save();
        res.status(200).json({
            message: 'Report type create successfully',
            newReport
        });
    } catch (error) {
        throw new Error('Error happen when creating report type.')
    }
};

export const deleteReportType = async (req, res, next) => {
    try {
        const reportTypeID = req.params.id;
        await reportTypes.findOneAndDelete({reportTypeID: reportTypeID});
        res.status(200).json({
            message: 'Delete successful.'
        })
    } catch (error) {
        throw new Error('Error happened when delete report type.');
    }
};