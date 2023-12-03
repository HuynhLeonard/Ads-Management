import mongoose from 'mongoose';

const ReportTypeSchema = new mongoose.Schema({
    reportTypeID: {
        type: String,
        required: true,
        unique: true
    },
    reportTypeName: {
        type: String,
        required: true
    },
    reportTypeDes: {
        type: String,
        required: true
    }
});

// ReportTypeSchema.pre('save', async function(next){
//     const reporttype = this;
//     const count = await reportTypes.countDocuments();
//     reporttype.reportTypeID = 'LH-BC' + String(count + 1).padStart(3,'0');
//     next();
// });

const reportTypes = mongoose.model('reportTypes', ReportTypeSchema);
export default reportTypes;