import { getSingleBoard } from "../../services/boardService.js";
import { getAllBoardType, getSingleBoardType } from "../../services/boardTypeService.js";
import { getDistrictByID } from "../../services/districtService.js";
import { createLicense, deleteLicenseRequest, getRequestByUsername, getSingleRequest } from "../../services/licensingService.js";
import { getLocationFromDistricts, getLocationFromWard, getSingleLocation } from "../../services/locationService.js";
import { getRoleByUsername } from "../../services/userService.js";
import { getWardOfDistrict } from "../../services/wardService.js";

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

    if(role === 'district') {
        officerRoleName = await getDistrictByID(officerRole);
        officerRoleName = officerRoleName.districtName;
    }

    let wardsOfDistrict = [];
    if(role === 'ward') {
        wardsOfDistrict = await getWardOfDistrict(officerRole);
        wardsOfDistrict = wardsOfDistrict.map((ward) => `Phường ${ward.wardName}`);
    }

    const data = await getRequestByUsername(req.user.username);

    const roleData = {
        district: {
            tableHeads: ['ID Yêu cầu', 'ID Điểm đặt', 'Công ty yêu cầu', 'Thời gian quảng cáo', 'Trạng thái'],
            tableData: await Promise.all(data.map(async (item) => {
                return {
                    id: item.requestID,
                    locationID: item.locationID,
                    companyName: item.companyName,
                    adsTime: `${convertDate(item.startDate)} - ${convertDate(item.endDate)}`,
                    state: (isOutDated(item.endDate)) ? "Đã hết hạn" : ((item.status === 0) ? "Chờ xử lý giấy phép" : ((item.status === 1) ? "Chấp thuận giấy phép" : "Từ chối giấy phép")),
                    actions: {
						edit: false,
						remove: false,
						info: true
					}
                }
            })),
            checkboxData: [...wardsOfDistrict],
            checkboxHeader: "Quận" + officerRoleName,
        },
        ward: {
            tableHeads: ['ID Yêu cầu', 'ID Điểm đặt', 'Công ty yêu cầu', 'Thời gian quảng cáo', 'Trạng thái'],
            tableData: await Promise.all(data.map(async (item) => {
                return {
                    id: item.requestID,
                    locationID: item.locationID,
                    companyName: item.companyName,
                    adsTime: convertDate(item.startDate) + '-' + convertDate(item.endDate),
                    state: (isOutDated(item.endDate)) ? "Đã hết hạn" : ((item.status === 0) ? "Chờ xử lý giấy phép" : ((item.status === 1) ? "Chấp thuận giấy phép" : "Từ chối giấy phép")),
                    actions: {
						edit: false,
						remove: false,
						info: true
					}
                }
            })),
        }
    }

    let roleInfo = roleData[role];
	// remove empty object
	roleInfo.tableData = roleInfo.tableData.filter(item => Object.keys(item).length !== 0);


	if (!roleInfo) {
		res.status(404);
		return res.render('error', {error: {status: 404, message: 'Không tìm thấy trang'}});
	}

    res.render('license', {url: req.originalUrl, title: title, ...roleInfo});

    // tableHeads: ['ID Yêu cầu', 'ID Điểm đặt', 'Công ty yêu cầu', 'Thời gian quảng cáo', 'Trạng thái']
};

const showDetail = async (req, res) => {
    const role = String(req.originalUrl.split('/')[1]);
	let title = ` - Chi tiết yêu cầu cấp phép quảng cáo`;
	title = (role === 'district' ? 'Quận' : 'Phường') + title;

	let data = await getSingleRequest(req.params.id);
	// console.log(data);
	let spotDetail = await getSingleLocation(data.locationID);
	const boardType = await getSingleBoardType(data.boardType);
	// console.log(spotDetail);
	data = {
		requestID: data.requestID,
		loactionID: data.locationID,
		name: spotDetail.locationName,
		address: `${spotDetail.address}, Phường ${spotDetail.wardName}, Quận ${spotDetail.districtName}`,
		company: data.companyName,
		phone: data.phoneNumber,
		email: data.companyEmail,
		compAddr: data.companyAddress,
		startTime: convertDate(data.startDate),
		endTime: convertDate(data.endDate),
		content: data.content,
		boardType: boardType.typeName,
		height: data.height,
		width: data.width,
		quantity: data.quantity,
		state: (isOutDated(data.endDate)) ? -2 : data.status,
		imgUrls: data.images,
	}
	// console.log(data);

	res.render('license-detail', {
		title,
		...data,
		url: req.originalUrl,
		role
	});
};

const showCreate = async (req, res) => {
	const role = String(req.originalUrl.split('/')[1]);
	let title = ' - Tạo yêu cầu cấp phép quảng cáo';
	title = (role === 'district' ? 'Quận' : 'Phường') + title;

	const officerRole = await getRoleByUsername(req.user.username);
	
	let locations = {};
	if(role === 'district'){
		locations = await getLocationFromDistricts(officerRole);
	} else {
		locations = await getLocationFromWard(officerRole);
	}

	// console.log(spots);

	locations = locations.map(location => {
		const {locationID, locationName, locationType, address, districtID, wardID, districtName, wardName, planned} = location;
		return {
			id: locationID,
			name: locationName,
			address: `${address}, Phường ${wardName}, Quận ${districtName}`,
		}
	});

	let curLocation = {};
	if(req.query.locationID != null){
		curSpot = await getSingleLocation(req.query.locationID);
	}
	// console.log(curSpot);
	// if(Object.keys(curSpot).length === 0) console.log(1);

	let boardtypes = await getAllBoardType();

	res.render('license-create', {url: req.originalUrl, role, title, boardtypes, locations, curLocation});
}

const showExtend = async (req, res) => {
	const role = String(req.originalUrl.split('/')[1]);
	let title = 'Yêu cầu Gia hạn quảng cáo';

	const boardDetail = await getSingleBoard(req.params.id);

	const commonData = {
		url: req.originalUrl,
		title,
	};

	const data = {
		id: boardDetail.boardID,
		locationID: boardDetail.loactionID,
		locationName: boardDetail.spotName,
		locationAddress: boardDetail.spotAddress,
		authCompany: boardDetail.authCompany,
		authCompanyAddress: boardDetail.authCompanyAddress,
		authCompanyPhone: boardDetail.authCompanyPhone,
		authCompanyEmail: boardDetail.authCompanyEmail,
		startDate: boardDetail.startDate.toLocaleDateString('vi-VN'),
		endDate: boardDetail.endDate.toLocaleDateString('vi-VN'),
		boardTypeName: boardDetail.boardTypeName,
		boardType: boardDetail.boardModelType,
		quantity: boardDetail.quantity,
		height: boardDetail.height,
		width: boardDetail.width,
		imgUrls: boardDetail.images,
		content: boardDetail.content,
	};

	res.render('board-extend', { ...commonData, ...data });

}

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
    showCreate,
    showExtend,
    add,
    deleteRequest,
};
