import * as ReportType from '../services/reportTypeService.js';

const controller = {}

controller.createReportType = async (req, res, next) => {
    const newData = req.body;
    console.log(newData);
    const result = await ReportType.createReportType(newData);
    res.status(200).json({
        result
    })
}

controller.deleteReportType = async (req, res, next) => {
    const reportTypeID = req.params.id;
    const result = await ReportType.deleteReportType(reportTypeID);
    res.status(200).json({
        result
    })
}

export default controller;