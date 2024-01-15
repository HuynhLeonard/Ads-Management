import { createLicense, deleteLicenseRequest } from "../../services/licensingService.js";
import {} from "../../services/locationService.js";
import {getRoleByUsername} from "../../services/userService.js";
import {} from "../../services/boardTypeService.js";
import {} from "../../services/boardService.js";
import {} from "../../services/districtService.js";
import {} from "../../services/wardService.js";

const convertDate = (date) => {
	const dateObject = new Date(date);

	const day = dateObject.getDate().toString().padStart(2, '0');
	const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
	const year = dateObject.getFullYear();

	return `${day}/${month}/${year}`;
}

const isOutDated = (date) => {
	const curDate = new Date();
	const inDate = new Date(date);

	return inDate < curDate;
}

const show = async (req, res) => {
    const role = String(req.originalUrl.split('/')[1]);
	let title = role === 'district' ? 'Quận - Quản lý yêu cầu cấp phép' : 'Phường - Quản lý yêu cầu cấp phép';
    const officerRole = await getRoleByUsername(req.user.username);
	let officerRoleName = "";

    if(role == 'disitrct') {

    }
    let wardsOfDistrict = [];
    if(role == 'ward') {
        
    }

    // tableHeads: ['ID Yêu cầu', 'ID Điểm đặt', 'Công ty yêu cầu', 'Thời gian quảng cáo', 'Trạng thái']
};

const showDetail = (req, res) => {};

const add = async (req, res) => {
    try {
        const license = req.body;
        license.status = 0;
        await createLicense(license);
        res.status(200).json({
            license,
        });
    } catch (error) {
        res.status(500).json("Getting error when add new license request");
    }
};

const deleteRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const role = String(req.originalUrl.split("/")[1]);
        await deleteLicenseRequest(id);
        res.redirect(`${role}/license`);
    } catch (error) {
        res.status(500).json("Getting error when delete license request");
    }
};

export default {
    show,
    showDetail,
    add,
    deleteRequest,
};
