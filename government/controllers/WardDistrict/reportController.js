import * as userService from "../../services/userService.js";
import * as reportService from "../../services/reportService.js";
import * as districtService from "../../services/districtService.js";
import * as wardService from "../../services/wardService.js";
import emailService from "../../services/emailService.js";
import * as locationService from "../../services/locationService.js";
import * as boardService from "../../services/boardService.js";
import * as locationService from "../../services/locationService.js";

const convertDate = (date) => {
    const dateObject = new Date(date);
    const day = dateObject.getDate().toString().padStart(2,'0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();

    return `${day}/${month}/${year}`;
};

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
    updateReport
}