import express from 'express';
const router = express.Router();
import * as api from "../controllers/MainAPI/main.js";

export const setHeaders = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Origin, Origin');
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Content-Type', 'application/json');
    next();
};

// get all location show on map
router.get('/map/locations', (req,res) => {
    api
        .getAllLocations(req.query.districtID, req.query.wardID)
        .then((location) => res.status(200).json(location))
        .catch((err) => res.status(500).json({message: err.message}));
});

router.get('/locations/:locationID', (req, res) => {
    // set cross origin request headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    let getAll = true
    if (req.query.role == 'citizen') {
        getAll = false
    }
    api
        .getDetailLocation(req.params.spotID, getAll)
        .then((location) => res.status(200).json(location))
        .catch((err) => res.status(500).json({ message: err.message }))
});

router.get('/reports' , (req, res) => {
    api
        .getListReport(req.query.reportIDs)
        .then((reports) => res.status(200).json(reports))
        .catch((err) => res.status(500).json({ message: err.message }))
  });

router.get('/reports/:reportID', (req,res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    api
        .getReport(req.params.reportID)
        .then((report) => res.status(200).json(report))
        .catch((err) => res.status(500).json({ message: err.message }))
});

router.post('/reports', (req, res) => {
    api
        .createReport(req.body)
        .then((report) => res.status(200).json(report))
        .catch((err) => res.status(500).json({ message: err.message }))
});

router.get('/report-types', (req, res) => {
    api
        .getAllReportTypes()
        .then((reportTypes) => res.status(200).json(reportTypes))
        .catch((err) => res.status(500).json({ message: err.message }))
    });

router.get('/boards/:boardID', (req, res) => {
    api
        .getBoard(req.params.boardID)
        .then((board) => res.status(200).json(board))
        .catch((err) => res.status(500).json({ message: err.message }))
});

router.get('/district-ward-name', (req, res) => {
    api
        .getDistrictWardName(req.query.lat, req.query.lng)
        .then((districtWardName) => res.status(200).json(districtWardName))
        .catch((err) => res.status(500).json({ message: err.message }))
  });

export default router;