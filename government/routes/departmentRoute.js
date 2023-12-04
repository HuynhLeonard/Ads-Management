import express from 'express';
import locationController from '../controllers/locationsController.js';
import reportTypesController from '../controllers/reportTypeController.js';

const router = express.Router();

router.get('/location', locationController.getAllLocation);
router.post('/location', locationController.createLocation);

router.post('/reportType/create-reportType', reportTypesController.createReportType);
router.delete('/reportType/:id', reportTypesController.deleteReportType);

export default router;