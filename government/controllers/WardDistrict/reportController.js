import {createToolbar} from './utilities.js';
import {getRoleByUsername, getOfficerByUsername} from '../../services/officerService.js';
import {getReportByOfficerRole, getReportByID, updateReportByID} from '../../services/reportService.js';
import {getDistrictByID} from '../../services/districtService.js';
import {getWardByID, getWardsOfDistrict} from '../../services/wardService.js';
import emailService from '../../services/emailService.js';

const convertDate = (date) => {
	const dateObject = new Date(date);

	const day = dateObject.getDate().toString().padStart(2, '0');
	const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
	const year = dateObject.getFullYear();

	return `${day}/${month}/${year}`;
}

const show = async (req, res) => {
	const role = String(req.originalUrl.split('/')[1]);
	let title = role === 'quan' ? 'Quận - Quản lý báo cáo vi phạm' : 'Phường - Quản lý báo cáo vi phạm';

	const officerRole = await getRoleByUsername(req.user.username);
	let officerRoleName = "";
	if(role === 'quan'){
		officerRoleName = await getDistrictByID(officerRole);
		officerRoleName = officerRoleName.districtName;
	}

	// console.log(wardsOfDistrict);

	const data = await getReportByOfficerRole(officerRole);

	const roleData = {
		quan: {
			tableHeads: ['ID Báo Cáo', 'ID DD / QC', 'Loại hình báo cáo', 'Phường'
				, 'Họ tên người gửi', 'Email', 'Thời điểm gửi', 'Trạng thái'],
			tableData: data.map((item) => {
				return {
					id: item.reportID,
					objectID: item.objectID,
					reportType: item.reportType,
					ward: item.wardName,
					reporterName: item.reporterName,
					reporterEmail: item.reporterEmail,
					sendTime: convertDate(item.sendTime),
					state: item.status === 1 ? "Đã xử lý" : "Đang xử lý",
					actions: {
						edit: false,
						remove: false,
						info: true
					}
				}
			}),
			checkboxHeader: "Quận " + officerRoleName,
		},
		phuong: {
			tableHeads: ['ID Báo Cáo', 'ID DD / QC', 'Loại hình báo cáo',
				'Họ tên người gửi', 'Email', 'Thời điểm gửi', 'Trạng thái'],
			tableData: data.map((item) => {
				return {
					id: item.reportID,
					objectID: item.objectID,
					reportType: item.reportType,
					reporterName: item.reporterName,
					reporterEmail: item.reporterEmail,
					sendTime: convertDate(item.sendTime),
					state: item.status === 1 ? "Đã xử lý" : "Đang xử lý",
					actions: {
						edit: false,
						remove: false,
						info: true
					}
				}
			}),
		},
	}

	const roleInfo = roleData[role];
	if (!roleInfo) {
		res.status(404);
		return res.render('error', {error: {status: 404, message: 'Không tìm thấy trang'}});
	}

	// console.log(roleInfo);
	let wardsOfDistrict = []
	if (role === 'quan') {
		wardsOfDistrict = await getWardsOfDistrict(officerRole)
		wardsOfDistrict = wardsOfDistrict.map((ward) =>{
			return {
			  name: `Phường ${ward.wardName}`,
			  status: roleInfo.tableData.some(item => item.ward === ward.wardName)
			}
		});

		roleInfo.checkboxData = wardsOfDistrict
	}

	// console.log(wardsOfDistrict);

	res.render('reports', {url: req.originalUrl, title: title, ...roleInfo, toolbars: createToolbar(role)});
}

const showDetail = async (req, res) => {
	const role = String(req.originalUrl.split('/')[1]);
	const reportID = req.params.id;
	const dataFetch = await getReportByID(reportID);
	// console.log(dataFetch);
	let title = role === 'quan' ? 'Quận - Chi tiết báo cáo vi phạm' : 'Phường - Chi tiết báo cáo vi phạm';

	const officerName = req.user.username;
	// console.log(officerName);

	const data = {
		id: dataFetch.reportID,
		phone: dataFetch.reporterPhone,
		state: dataFetch.status,
		objectID: dataFetch.objectID,
		reportType: dataFetch.reportTypeName,
		sendTime: convertDate(dataFetch.sendTime),
		name: dataFetch.reporterName,
		email: dataFetch.reporterEmail,
		content: dataFetch.reportInfo,
		solution: dataFetch.solution,
		imgUrls: [...dataFetch.reportImages],
		officer: dataFetch.officerName,
		district: dataFetch.officerDistrict,
		ward: dataFetch.officerWard,
	}
	res.render('report-detail', {role, title, officerName, toolbars: createToolbar(role), ...data});
}

const updateReport = async (req, res) => {
	const reportID = req.params.id;
	const dataToUpdate = req.body;
	const role = String(req.originalUrl.split('/')[1]);
	
	// console.log(reportID);
	// console.log(dataToUpdate);

	const reportInfo = await getReportByID(reportID);
	let officer = await getRoleByUsername(dataToUpdate.officerName);

	if(role == 'quan'){
		officer = await getDistrictByID(officer);
		officer = {
			ward: "",
			district: officer.districtName
		}
	} else {
		officer = await getWardByID(officer);
		const district = await getDistrictByID(officer.districtID);
		officer = {
			ward: officer.wardName,
			district: district.districtName,
		}
	}

	const emailData = {
		reporterName: reportInfo.reporterName.toUpperCase(),
		reporterEmail: reportInfo.reporterEmail,
		officer: officer,
		solution: dataToUpdate.solution
	}

	emailService.sendReportSolution(emailData);

	try {
		const message = await updateReportByID(reportID, dataToUpdate);
		console.log(message);
		res.redirect(`/${role}/reports`);
	} catch (error) {
		console.log(error.message);
		req.flash('error', error.message);
	}
}

export default {
	show,
	showDetail,
	updateReport,
};