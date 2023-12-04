import express from 'express';
import locationController from '../controllers/locationsController.js';
import userController from '../controllers/userController.js';
const router = express.Router();

router.get('/location', locationController.getAllLocation);
router.post('/location', locationController.createLocation);
router.get('/location/:id', locationController.getLocation);

// create and assign user for district and wards
router.post('/user', userController.createUser);
export default router;