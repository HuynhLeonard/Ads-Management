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

router.get('/reports');

router.get('/reports/:reportID');

router.post('/reports');

router.get('/report-types');

router.get('/boards/:boardID');

export default router;