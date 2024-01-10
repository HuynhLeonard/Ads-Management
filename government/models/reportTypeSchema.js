import mongoose from 'mongoose';

const ReportTypeSchema = new mongoose.Schema({
    reportTypeID: {
        type: String,
        unique: true
    },
    typeName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
});

export default mongoose.model("ReportType", ReportTypeSchema);