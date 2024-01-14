import * as userService from "../../services/userService.js";
import * as reportService from "../../services/reportService.js";
import * as districtService from "../../services/districtService.js";
import * as wardService from "../../services/wardService.js";
import emailService from "../../services/emailService.js";
import * as boardService from "../../services/boardService.js";
import * as locationService from "../../services/locationService.js";
import * as locationDetailService from "../../services/location-detailService.js"

const convertDate = (date) => {
    const dateObject = new Date(date);
    const day = dateObject.getDate().toString().padStart(2,'0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();

    return `${day}/${month}/${year}`;
};

const show = async (req,res) => {
    const role = String(req.originalUrl.split('/')[1]);
    let title = role === 'district' ? 'Quận - Báo Cáo' : 'Phường - Báo Cáo'

    const officerRole = await userService.getRoleByUsername(req.user.username);
    let roleName = '';
    if(role === 'district') {
        roleName = await districtService.getDistrictByID(officerRole);
        roleName = roleName.districtName;
    }

    const data = await reportService.getReportByOfficerRole(officerRole);
    console.log('report type service');
    console.log(data);
    
    const roleData = {
		district: {
			tableHeads: ['ID', 'Điểm đặt/ Quảng Cáo', 'Loại hình báo cáo', 'Phường'
				, 'Họ tên người gửi', 'Email', 'Thời điểm gửi', 'Tình Trạng'],
			tableData: await Promise.all(data.map(async (item) => {
				let wardName = item.wardName;
			
				if (item.objectID.includes('AD')) {
					const lat = item.objectID.split(':')[1];
					const lng = item.objectID.split(':')[0].replace('AD', '');
					const location = await locationDetailService.getDistrictWardName(lat, lng);
					const districtID = location.districtID;

					// if districtID is not equal to officerRole, then return empty object
					if (districtID !== officerRole) {
						return {};
					}

					wardName = location.wardName;
				}
				return {
					id: item.reportID,
					objectID: item.objectID,
					reportType: item.reportType,
					ward: wardName,
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
			})),
			checkboxHeader: "Quận " + roleName,
		},
		ward: {
			tableHeads: ['ID Báo Cáo', 'ID DD / QC', 'Loại hình báo cáo',
				'Họ tên người gửi', 'Email', 'Thời điểm gửi', 'Trạng thái'],
			tableData: await Promise.all(data.map(async (item) => {
				if (item.objectID.includes('AD')) {
					const lat = item.objectID.split(':')[1];
					const lng = item.objectID.split(':')[0].replace('AD', '');
					const location = await locationDetailService.getDistrictWardName(lat, lng);
					console.log(location);
					const wardID = location.wardID;
					console.log(officerRole);
					console.log(wardID);

					// if wardID is not equal to officerRole, then return empty object
					if (wardID !== officerRole) {
						return {};
					}
				}

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
		)	},
	}

    let roleInfo = roleData[role];
	// remove empty object
	roleInfo.tableData = roleInfo.tableData.filter(item => Object.keys(item).length !== 0);

	// console.log(roleInfo);

	if (!roleInfo) {
		res.status(404);
		return res.render('error', {error: {status: 404, message: 'Không tìm thấy trang'}});
	}

	// console.log(roleInfo);
	let wardsOfDistrict = []
	if (role === 'district') {
		wardsOfDistrict = await wardService.getWardOfDistrict(officerRole)
		wardsOfDistrict = wardsOfDistrict.map((ward) =>{
			return {
				name: `Phường ${ward.wardName}`,
				status: roleInfo.tableData.some(item => item.ward === ward.wardName)
			}
		});

		roleInfo.checkboxData = wardsOfDistrict
	}

	// console.log(wardsOfDistrict);

	res.render('reports', {url: req.originalUrl, title: title, ...roleInfo});
}

// :id
const updateReport = async (req,res) => {
    const reportID = req.params.id;
    const dataToUpdate = req.body;
    const role = String(req.originalUrl.split('/')[1]);

    const reportInfo = await reportService.getSingleReport(reportID);
    let officer = await userService.getRoleByUsername(dataToUpdate.officerName);

    if(role === 'district') {
        officer = await districtService.getDistrictByID(officer);
        officer = {
            ward: '',
            district: officer.districtName
        }
    } else {
        officer = await wardService.getWard(officer);
        const district = await districtService.getDistrictByID(officer.districtID);
        officer = {
            ward: officer.wardName,
            district: district.districtName
        }
    };

    const emailData = {
        reporterName: reportInfo.reporterName.toUpperCase(),
        reporterEmail: reportInfo.reporterEmail,
        officer: officer,
        solution: dataToUpdate.solution
    }

    emailService.sendReportSolution(emailData);

    try {
        const message = await reportService.updateReport(reportID, dataToUpdate);
        res.redirect(`/${role}/reports`);
    } catch (error) {
        req.flash('error', error.message);
    }
};

export default {
    updateReport,
    show
}