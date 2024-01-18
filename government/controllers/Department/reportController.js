import * as boardService from '../../services/boardService.js'
import * as districtService from '../../services/districtService.js'
import * as locationDetailService from "../../services/location-detailService.js"
import * as locationService from '../../services/locationService.js'
import * as reportService from '../../services/reportService.js'

const controller = {}


const convertDate = (date) => {
    const dateObject = new Date(date);

    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = dateObject.getFullYear();

    return `${day}/${month}/${year}`;
}

controller.show = async (req, res) => {
    let tableData = []
    const tableHeads = [
        'ID Báo cáo', 'ID Điểm/Bảng', 'Quận', 'Phường', 'Loại hình', 'Người gửi', 'Ngày gửi', 'Trạng thái'
    ];

    const role = String(req.originalUrl.split('/')[1])


    let checkboxHeader = 'Thành phố Hồ Chí Minh'

    const data = await reportService.getAllReport();
    console.log(data);
    tableData = await Promise.all(data.map(async (item) => {
        let districtName = item.spotDistrictName[0];
        let wardName = item.spotWardName[0];

        // console.log(item.objectID);

        if (item.objectID.includes('AD')) {
            const lat = item.objectID.split(':')[1];
            const lng = item.objectID.split(':')[0].replace('AD', '');
            const location = await locationDetailService.getDistrictWardName(lat, lng);
            districtName = 'Quận ' + location.districtName;
            wardName = 'Phường ' +location.wardName;
        }

        return {
            id: item.reportID,
            objectID: item.objectID,
            district: districtName,
            ward: wardName,
            reportType: item.reportType,
            reporterName: item.reporterName,
            sendTime: convertDate(item.sendTime),
            state: item.status === 1 ? "Đã xử lý" : "Đang xử lý",
            actions: {
                edit: false,
                remove: false,
                info: true
            }
        }
    }));

    // console.log(tableData);

    let checkboxData = await districtService.getAllDistricts()
    checkboxData = checkboxData.map((dist) => {
        return {
            name: `${dist.districtName}`,
            status: tableData.some(item => item.district === dist.districtName)
        }
    });

    const commonData = {
        url: req.originalUrl,
        role: role,
        checkboxData: checkboxData,
        checkboxHeader: checkboxHeader
    }

    const title = 'Sở - Quản lý danh sách các báo cáo vi phạm';
    return res.render('Department/reports', { title, tableHeads, tableData, ...commonData })
}

controller.showDetail = async (req, res) => {
    const id = req.params.id
    const dataFetch1 = await reportService.getSingleReport(id);
    const dataFetch = dataFetch1[0];
    console.log('data fetch',dataFetch);
    if (dataFetch.objectID.includes('QC')) {
        const boardDetail = await boardService.getSingleBoard(dataFetch.objectID);

        dataFetch.spotAddress = boardDetail.spotAddress;
        dataFetch.district = boardDetail.districtName;
        dataFetch.ward = boardDetail.wardName;
    }
    if (dataFetch.objectID.includes('LC')) {
        const spotDetail = await locationService.getSingleLocation(dataFetch.objectID);

        dataFetch.spotAddress = spotDetail.address;
        dataFetch.district = spotDetail.districtName;
        dataFetch.ward = spotDetail.wardName;
    }
    if (dataFetch.objectID.includes('AD')) {
        const addrDetail = await locationDetailService.getDistrictWardName(dataFetch.objectID.split(':')[1], dataFetch.objectID.split(':')[0].replace('AD', ''));

        dataFetch.spotAddress = addrDetail.address;
        dataFetch.district = addrDetail.districtName;
        dataFetch.ward = addrDetail.wardName;
    }

    const detail = {
        id: dataFetch.reportID,
        phone: dataFetch.phoneNumber,
        state: dataFetch.status,
        objectID: dataFetch.objectID,
        reportType: dataFetch.reportType,
        sendTime: convertDate(dataFetch.sendTime),
        name: dataFetch.reporterName,
        email: dataFetch.reporterEmail,
        content: dataFetch.reportInfo,
        solution: dataFetch.solution,
        imgUrls: [...dataFetch.reportImages],
        officer: dataFetch.officer,
        spotAddress: dataFetch.spotAddress,
        spotDistrict: dataFetch.district,
        spotWard: dataFetch.ward,
        district: dataFetch.userDistrictName
    }
    console.log('detail', detail)
    const title = 'Sở - Chi tiết báo cáo vi phạm'
    return res.render('Department/report-detail', { title, detail})
}

controller.showStatistic = async (req, res) => {
    const title = 'Sở - Thống kê báo cáo vi phạm';
    const basicCountReports = await reportService.basicCountReports();

    // Số lượng báo cáo theo loại
    let reportTypeCount = await reportService.getReportTypeCounts();
    reportTypeCount = reportTypeCount.map((item) => {
        return {
            reportTypeName: item._id,
            amount: item.count,
        };
    });

    // Số lượng báo cáo theo quận
    let reportDistrictCounts = await reportService.getReportCountsDistrict();

    const allDistricts = await districtService.getAllDistricts();

    reportDistrictCounts = allDistricts.map(district => {
        const reportCount = reportDistrictCounts.find(item => item._id[0] === district.districtID);
        return {
            districtName: district.districtName,
            reportCount: reportCount ? reportCount.count : 0
        };
    });

    // Số lượng báo cáo theo đối tượng
    let reportObjectCounts = await reportService.getReportCountsByObjectType();


    reportObjectCounts = reportObjectCounts.map(report => {
        return {
            object: report._id === 'board' ? 'Bảng quảng cáo' : 'Điểm đặt',
            amount: report.count
        }
    });

    res.render('./so/report-statistic', { title, ...basicCountReports, reportTypeCount, reportDistrictCounts, reportObjectCounts });
}

export default controller
