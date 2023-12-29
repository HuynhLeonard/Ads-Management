import express from 'express';
const router = express.Router();

export const setHeaders = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Origin, Origin');
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Content-Type', 'application/json');
    next();
};

// get all location show on map
router.get('/map/locations');

router.get('/locations/:locationID');

router.get('/reports');

router.get('/reports/:reportID');

router.post('/reports');

router.get('/report-types');

router.get('/boards/:boardID');

export default router;