import report from '../models/reportAdsSchema.js';

export const createReport = async (reportData) => {
    try {
        const newReport = new report(reportData);
        // const count = await report.countDocuments();
        // newReport.reportID = 'BC' + String(count + 1).padStart(3,'0');
        const saveData = await newReport.save();
        return saveData.reportID;
    } catch (error) {
        throw new Error('Error happen when creating report.')
    }
};

export const updateReport = async (reportID,updateData) => {
    try {
        const updatedReport = await report.findOneAndUpdate({reportID: reportID}, {$set: updateData});
        
        return {message: 'Report update successfully'};
    } catch (error) {
        throw new Error('Error happened when update report.')
    }
};

export const getAllReport = async () => {
    const option = [
        {
          $lookup: {
            from: 'reporttypes',
            localField: 'reportType',
            foreignField: 'reportTypeID',
            as: 'reportType'
          }
        },
        {
          $unwind: {
            path: '$reportType',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'locations',
            localField: 'objectID',
            foreignField: 'locationID',
            as: 'spotInfo'
          }
        },
        {
          $lookup: {
            from: 'boards',
            localField: 'objectID',
            foreignField: 'boardID',
            as: 'boardInfo'
          }
        },
        {
          $unwind: {
            path: '$boardInfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'locations',
            localField: 'boardInfo.locationID',
            foreignField: 'locationID',
            as: 'boardSpotInfo'
          }
        },
        {
          $project: {
            _id: 0,
            reportID: 1,
            objectID: 1,
            reportType: '$reportType.reportTypeName',
            reporterName: 1,
            sendTime: 1,
            status: 1,
            spotDistrictID: {
              $cond: {
                if: { $eq: ['$boardSpotInfo', []] },
                then: '$spotInfo.districtID',
                else: '$boardSpotInfo.districtID'
              }
            },
            spotWardID: {
              $cond: {
                if: { $eq: ['$boardSpotInfo', []] },
                then: '$spotInfo.wardID',
                else: '$boardSpotInfo.wardID'
              }
            },
          }
        },
        {
          $lookup: {
            from: 'districts',
            localField: 'spotDistrictID',
            foreignField: 'districtID',
            as: 'spotDistrict'
          }
        },
        {
          $lookup: {
            from: 'wards',
            localField: 'spotWardID',
            foreignField: 'wardID',
            as: 'spotWard'
          }
        },
        {
            $project: {
                reportID: 1,
                objectID: 1,
                reportType: 1,
                reporterName: 1,
                sendTime: 1,
                status: 1,
                spotDistrictName: '$spotDistrict.districtName',
                spotWardName: '$spotWard.wardName'
            }
        }
    ]
    try {
        const reports = await report.aggregate(option);
        return reports;
    } catch (error) {
        console.log(error);
        throw new Error('Error happened when getting all report.');
    }
};

// query
export const getSingleReport = async (reportID) => {
    const option = [
        {
          $lookup: {
            from: 'reporttypes',
            localField: 'reportType',
            foreignField: 'reportTypeID',
            as: 'reportType'
          }
        },
        {
          $unwind: {
            path: '$reportType',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'officer',
            foreignField: 'username',
            as: 'officer'
          }
        },
        {
          $unwind: {
            path: '$officer',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'districts',
            localField: 'officer.districtID',
            foreignField: 'districtID',
            as: 'officerDistrict'
          }
        },
        {
          $unwind: {
            path: '$officerDistrict',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'wards',
            localField: 'officer.wardID',
            foreignField: 'wardID',
            as: 'officerWard'
          }
        },
        {
          $unwind: {
            path: '$officerWard',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 0,
            reportID: 1,
            objectID: 1,
            reportType: 1,
            reportTypeName: '$reportType.reportTypeName',
            reporterName: 1,
            reporterEmail: 1,
            reporterPhone: 1,
            sendTime: 1,
            status: 1,
            reportInfo: 1,
            solution: 1,
            reportImages: 1,
            officer: 1,
            officerDistrict: '$officerDistrict.districtName',
            officerWard: '$officerWard.wardName',
          }
        }
      ]
    try {
        let report = await Report.aggregate([
            { $match: { 'reportID': reportID } }, ...option]);
            report = report[0];
            return report;
    } catch (error) {
        throw new Error('Error happened when getting single report.');
    }
};

export const getReportsByObjectID = async (objectID) => {
    try {
        const reports = await Report.find({ objectID });
        return reports;
    } catch (error) {
        throw new Error(`Error getting reports by objectID: ${error.message}`);
    }
};

export const getReportsByType = async (reportType) => {
    try {
        const reports = await Report.find({ reportType });
        return reports;
    } catch (error) {
        throw new Error(`Error getting reports by type: ${error.message}`);
    }
};

export const getReportsByStatus = async (status) => {
    try {
        const reports = await Report.find({ status });
        return reports;
    } catch (error) {
        throw new Error(`Error getting reports by status: ${error.message}`);
    }
};

export const getReportByOfficerRole = async (role) => {

};

export const getReportsWithDistrictID = async () => {

};

export const getReportTypeCounts = async () => {

};

export const getReportCountsDistrict = async () => {

};

export const getReportCountsByObjectType = async () => {
    
}

export const basicCountReports = async () => {
    const totalReports = await Report.countDocuments();
    const handledReports = await Report.countDocuments({ status: 1 });
    const notHandledReports = await Report.countDocuments({ status: 0 });

    return {totalReports, handledReports, notHandledReports};
}

export const deleteReport = async (reportID) => {
    try {
        await report.findOneAndDelete({reportID: reportID});
        return { message: 'Delete successful.' };
    } catch (error) {
        throw new Error('Error happened when delete report.');
    }
};