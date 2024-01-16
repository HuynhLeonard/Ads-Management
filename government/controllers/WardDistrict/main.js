import adsController from './advertisementController.js';
import infoController from '../Department/infoController.js';
import licenseController from './licenseController.js';
import reportController from './reportController.js';
const indexController = {
	show: (req, res) => {
		const role = String(req.originalUrl.split('/')[1]);
		res.render('WardDistrict/index', {title: `${role === 'district' ? 'Quận' : 'Phường'} - Trang chủ`,role});
	}
}

export default {
    adsController,
    infoController,
    indexController,
	reportController,
	licenseController
}

