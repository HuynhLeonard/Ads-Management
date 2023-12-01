import mongoose from "mongoose";

const ReportAdsSchema = new mongoose.Schema({
    reportID: {
        type: String,
        required: true,
        unique: true
    },
    reportType: {
        type: String,
        required: true
    },
    boardID: {
        type: String,
        required: true
    },
    reportImages: {
        type: [String],
        required: true
    },
    reporterName: {
        type: String,
        required: true
    },
    reportInfo: {
        type: String,
        required: true
    },
    reporterEmail: {
        type: String,
        required: true
    },
    reporterPhone: {
        type: String,
        required: true
    },
    sendTime: {
        type: Date,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    solution: {
        type: String
    }

    
});

const Report = mongoose.model('reports', ReportSchema);
export default Report;