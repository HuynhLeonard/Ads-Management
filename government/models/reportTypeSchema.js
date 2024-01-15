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

ReportTypeSchema.pre('save', async function(next){
    const rpType = this;
    const count = await ReportTypeSchema.countDocuments();
    rpType.reportTypeID = 'HT-BC' + String(count + 1).padStart(3,'0');
    next();
});

export default mongoose.model("ReportType", ReportTypeSchema);