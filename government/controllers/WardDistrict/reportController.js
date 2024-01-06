import * as Report from '../../services/reportAdsService.js';

const controller = {}

controller.createReport = async (req, res, next) => {
    const newData = req.body;
    const result = await Report.createReport(newData);
    res.status(200).json({
        result
    })
}

controller.updateReport = async (req,res,next) => {
    const updatedData = req.body;
    const reportID = req.params.id;
    const result = await Report.updateReport(reportID, updatedData);
    res.status(200).json({
        result
    });
};

controller.getAllReport = async (req,res,next) => {
    const result = await Report.getAllReport();
    res.status(200).json({
        result
    })
};

controller.getSingleReport = async (req,res,next) => {
    const reportID = req.params.id;
    const result = await Report.getSingleReport(reportID);
    res.status(200).json({
        result
    });
};

controller.getReportsByObjectID = async (req,res,next) => {
    const objectID = req.params.id;
    const result = await Report.getReportsByObjectID(objectID);
    res.status(200).json({
        result
    });
};

controller.getReportsByStatus = async (req,res,next) => {
    const status = req.params.id;
    const result = await Report.getReportsByStatus(status);
    res.status(200).json({
        result
    });
};

controller.getReportsByType = async (req,res,next) => {
    const reportType = req.params.id;
    const result = await Report.getReportsByType(reportType);
    res.status(200).json({
        result
    });
};

controller.deleteReport = async (req, res, next) => {
    const reportID = req.params.id;
    const result = await Report.deleteReport(reportID);
    res.status(200).json({
        result
    })
}

export default controller;