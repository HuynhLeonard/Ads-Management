import express from 'express';
import locationController from '../controllers/locationsController.js';
const router = express.Router();

router.get('/location', locationController.getAllLocation);
router.post('/location', locationController.createLocation);
router.get('/location/:id', locationController.getLocation);

export default router;