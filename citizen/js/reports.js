import { getReportList, getDistrictWardName } from "./request.js";

let reportIDs = localStorage.getItem('reportIDs');
reportIDs = reportIDs ? reportIDs.split(',') : [];

// console.log(reportIDs);

const reportData = await getReportList(reportIDs);
console.log(reportData);

const table = $('#table');
const formater = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const boardData = await Promise.all(reportData.map(async (report) => {
  let districtName = report.spotDistrictName;
  let wardName = report.spotWardName;

  if (report.objectID.includes('AD')) {
    try {
      const lat = report.objectID.split(':')[1];
      const lng = report.objectID.split(':')[0].replace('AD', '');
      const res = await getDistrictWardName(lng, lat);
      districtName = res.districtName;
      wardName = res.wardName;
    } catch (err) {
      console.log(err);
    }
  }

  const data = {
    id: report.reportID,
    object_id: report.objectID,
    district: districtName,
    ward: wardName,
    type: report.reportType,
    send_time: formater.format(new Date(report.sendTime)),
    status: report.status === 0 ? `<span class="text-danger">Chờ xử lý</span>` : `<span class="text-success">Đã xử lý</span>`,
    detail: `<div class="d-flex flex-row align-items-center justify-content-center">
              <a href="./report-detail.html?id=${report.reportID}">
                <img src="./assets/info.svg" alt="edit-icon" style="background-color: transparent"/>
              </a>
            </div>`
  }

  return data;
}));

table.bootstrapTable("load", boardData);
