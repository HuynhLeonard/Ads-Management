import {createToolbar} from './utilities.js';
import { getSpotsByDistrictID, getSpotsByWardID, getSpotByID } from '../../services/spotService.js'
import { create, getByUsername, getByID, remove } from '../../services/licensingRequestService.js'
import { getRoleByUsername } from '../../services/officerService.js';
import { getAllBoardTypes, getBoardTypeByID } from '../../services/boardTypeService.js';
import { getWardsOfDistrict } from '../../services/wardService.js';
import { getDistrictByID } from '../../services/districtService.js';
import * as IDGenerator from '../../services/IDGenerator.js';

const convertDate = (date) => {
	const dateObject = new Date(date);

	const day = dateObject.getDate().toString().padStart(2, '0');
	const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
	const year = dateObject.getFullYear();

	return `${day}/${month}/${year}`;
}

const show = async (req, res) => {
	const role = String(req.originalUrl.split('/')[1]);
	let title = role === 'quan' ? 'Quận - Quản lý yêu cầu cấp phép' : 'Phường - Quản lý yêu cầu cấp phép';

	const officerRole = await getRoleByUsername(req.user.username);
	let officerRoleName = "";
	if(role === 'quan'){
		officerRoleName = await getDistrictByID(officerRole);
		officerRoleName = officerRoleName.districtName;
	}
	let wardsOfDistrict = []
	if (role === 'quan') {
		wardsOfDistrict = await getWardsOfDistrict(officerRole)
		wardsOfDistrict = wardsOfDistrict.map((ward) => `Phường ${ward.wardName}`);
	}

	let data = await getByUsername(req.user.username);
	// const roleInfo = {
	// 	tableHeads: getTableHeadsByRole(role),
	// 	...await getDataByRole(role, req.user.username),
	// 	checkboxData: [...wardsOfDistrict]
	// }

	const roleData = {
		quan: {
			tableHeads: ['ID Yêu cầu', 'ID Điểm đặt', 'Công ty yêu cầu', 'Thời gian quảng cáo', 'Trạng thái'],
			tableData: data.map((item) => {
				return {
					id: item.requestID,
					spotID: item.spotID,
					companyName: item.companyName,
					expired: `${convertDate(item.startDate)} - ${convertDate(item.endDate)}`,
					state: item.status === 0 ? "Chờ xử lý" : item.status === 1 ? "Đã chấp thuận" : "Đã từ chối",
					actions: {
						edit: false,
						remove: false,
						info: true
					}
				}
			}),
			checkboxData: [...wardsOfDistrict],
			checkboxHeader: "Quận " + officerRoleName,
		},
		phuong: {
			tableHeads: ['ID Yêu cầu', 'ID Điểm đặt', 'Công ty yêu cầu', 'Thời gian quảng cáo', 'Trạng thái'],
			tableData: data.map((item) => {
				return {
					id: item.requestID,
					spotID: item.spotID,
					companyName: item.companyName,
					expired: `${convertDate(item.startDate)} - ${convertDate(item.endDate)}`,
					state: item.status === 0 ? "Chờ xử lý" : item.status === 1 ? "Đã chấp thuận" : "Đã từ chối",
					actions: {
						edit: false,
						remove: false,
						info: true
					}
				}
			}),
		}
	}

	const roleInfo = roleData[role];

	// console.log(roleInfo.tableData[0].actions);

	if (!roleInfo) {
		res.status(404);
		return res.render('error', {error: {status: 404, message: 'Không tìm thấy trang'}});
	}
	res.render('license', {url: req.originalUrl, title: title, ...roleInfo, toolbars: createToolbar(role)});
}

const showDetail = async (req, res) => {
	const role = String(req.originalUrl.split('/')[1]);
	let title = ` - Chi tiết yêu cầu cấp phép quảng cáo`;
	title = (role === 'quan' ? 'Quận' : 'Phường') + title;

	let data = await getByID(req.params.id);
	// console.log(data);
	let spotDetail = await getSpotByID(data.spotID);
	const boardType = await getBoardTypeByID(data.boardType);
	// console.log(spotDetail);
	data = {
		requestID: data.requestID,
		spotID: data.spotID,
		name: spotDetail.spotName,
		address: `${spotDetail.address}, Phường ${spotDetail.wardName}, Quận ${spotDetail.districtName}`,
		company: data.companyName,
		phone: data.companyPhone,
		email: data.companyEmail,
		compAddr: data.companyAddress,
		startTime: convertDate(data.startDate),
		endTime: convertDate(data.endDate),
		content: data.content,
		boardType: boardType.typeName,
		height: data.height,
		width: data.width,
		quantity: data.quantity,
		state: data.status,
		imgUrls: data.adsImages,
	}
	// console.log(data);

	res.render('license-detail', {
		title,
		toolbars: createToolbar(role),
		...data,
		url: req.originalUrl,
		role
	});
}

const showCreate = async (req, res) => {
	const role = String(req.originalUrl.split('/')[1]);
	let title = ' - Tạo yêu cầu cấp phép quảng cáo';
	title = (role === 'quan' ? 'Quận' : 'Phường') + title;

	const officerRole = await getRoleByUsername(req.user.username);
	
	let spots = {};
	if(role === 'quan'){
		spots = await getSpotsByDistrictID(officerRole);
	} else {
		spots = await getSpotsByWardID(officerRole);
	}

	// console.log(spots);

	spots = spots.map(spot => {
		const {spotID, spotName, spotType, address, districtID, wardID, districtName, wardName, planned} = spot;
		return {
			id: spotID,
			name: spotName,
			address: `${address}, Phường ${wardName}, Quận ${districtName}`,
		}
	});

	let curSpot = {};
	if(req.query.spotID != null){
		curSpot = await getSpotByID(req.query.spotID);
	}
	// console.log(curSpot);
	// if(Object.keys(curSpot).length === 0) console.log(1);

	let boardtypes = await getAllBoardTypes();

	res.render('license-create', {url: req.originalUrl, role, title, boardtypes, spots, toolbars: createToolbar(role), curSpot});
}

const add = async (req, res) => {
	try {
		const data = req.body;
		data.requestID = await IDGenerator.getNewID('LicensingRequest');
		data.status = 0;
		await create(data);
		res.status(200).json({ message: 'Bảng quảng cáo đã được thêm thành công' })
	} catch (error) {
		console.error(error)
    	res.status(500).json({ message: 'Lỗi server' })
	}
}

const deleteRequest = async (req, res) => {
	const requestID = req.params.id;
	const role = String(req.originalUrl.split('/')[1]);

	try{
		const response = await remove(requestID);
		console.log(response);
		res.redirect(`/${role}/license`);
	} catch (error) {
		console.error('Error during DELETE request:', error.message);
	}
}

export default {
	add,
	show,
	showDetail,
	showCreate,
	deleteRequest
};
