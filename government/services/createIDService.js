import AdsForm from '../models/adsFormModel.js';
import Board from '../models/boardModel.js';
import BoardType from '../models/boardTypeModel.js';
import EditRequest from '../models/editRequestModel.js';
import LicensingRequest from '../models/licensingRequestModel.js';
import Report from '../models/reportModel.js';
import ReportType from '../models/reportTypeModel.js';
import Spot from '../models/spotModel.js';
import SpotType from '../models/spotTypeModel.js';

const id = {
    licensingRequests: 'requestID',
    adsforms: 'formID',
    boards: 'boardID',
    spots: 'spotID',
    districts: 'districtID',
    wards: 'wardID',
    reports: 'reportID',
    boardTypes: 'typeID',
    editRequests: 'requestID',
    reportTypes: 'typeID',
    spotTypes: 'typeID'
};


export const getMaxID = async (model) => {
    try {
        const maxID = await model.findOne().sort({ [id[model.modelName]]: -1 });
        return maxID;
    } catch (error) {
        throw new Error(`Error getting max ID: ${ error.message }`);
    }
};


export const getNewID = async (object) => {
    let model;
    switch (object) {
        case 'LicensingRequest':
            model = LicensingRequest;
            break;
        case 'AdsForm':
            model = AdsForm;
            break;
        case 'Board':
            model = Board;
            break;
        case 'Spot':
            model = Spot;
            break;
        case 'Report':
            model = Report;
            break;
        case 'BoardType':
            model = BoardType;
            break;
        case 'EditRequest':
            model = EditRequest;
            break;
        case 'ReportType':
            model = ReportType;
            break;
        case 'SpotType':
            model = SpotType;
            break;
        default:
            throw new Error('Invalid object');
    }

    const maxID = await getMaxID(model);
    if (!maxID) {
        return 1;
    }

    const numericPart = maxID[id[model.modelName]].replace(/^\D+/g, '');

    // Increment the numeric part and convert it to string
    let newNumericPart = (parseInt(numericPart) + 1).toString();
    while (newNumericPart.length < numericPart.length) {
        newNumericPart = '0' + newNumericPart;
    }

    // Format the new ID with the incremented numeric part
    return maxID[id[model.modelName]].replace(/\d+/, newNumericPart);
}