import {createLicense, deleteLicenseRequest} from "../../services/licensingService.js";
import {} from "../../services/locationService.js";
import {} from "../../services/userService.js";
import {} from '../../services/boardTypeService.js';
import {} from "../../services/boardService.js";
import {} from "../../services/districtService.js";
import {} from "../../services/wardService.js";

const show = (req,res) => {

};

const showDetail = (req,res) => {

};

const add = async (req,res) => {
	try {
		// lấy data với chỉnh sửa data
		
		// gọi database
	} catch (error) {
		res.status(500).json('Message.');
	}
};

// http://localhost:3000/district/license/:id
// http://localhost:3000/district/license?id=BC001
const deleteRequest = async (req,res) => {
	// lấy được id
	const id = req.query.id;
};