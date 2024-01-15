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
    objectID: {
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
    phoneNumber: {
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
    },
    officer: {
        type: String
    }
    
});

ReportAdsSchema.pre('save', async function(next){
    const rpAds = this;
    const count = await ReportAdsSchema.countDocuments();
    rpAds.reportID = 'BC' + String(count + 1).padStart(3,'0');
    next();
});

// save with a custom number, also datetime format here

const Report = mongoose.model('reports', ReportAdsSchema);
export default Report;