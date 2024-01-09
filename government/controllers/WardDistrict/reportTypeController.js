import * as ReportType from '../../services/reportTypeService.js';

const controller = {}

controller.createReportType = async (req, res, next) => {
    const newData = req.body;
    const result = await ReportType.createReportType(newData);
    res.status(200).json({
        result
    })
}

controller.updateReportType = async (req,res,next) => {
    const updatedData = req.body;
    const reportTypeID = req.params.id;
    const result = await ReportType.updateReportType(reportTypeID, updatedData);
    res.status(200).json({
        result
    });
};

controller.getAllReportType = async (req,res,next) => {
    const result = await ReportType.getAllReportType();
    
    res.status(200).json({
        result
    })
};

controller.getReportType = async (req,res,next) => {
    const reportTypeID = req.params.id;
    const result = await ReportType.getSingleReportType(reportTypeID);
    res.status(200).json({
        result
    });
};

controller.deleteReportType = async (req, res, next) => {
    const reportTypeID = req.params.id;
    const result = await ReportType.deleteReportType(reportTypeID);
    res.status(200).json({
        result
    })
}

export default controller;