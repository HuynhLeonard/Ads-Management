import mongoose from 'mongoose';

const ReportTypeSchema = new mongoose.Schema({
    reportTypeID: {
        type: String,
        required: true,
        unique: true
    },
    reportTypeName: {
        type: String,
        required: true,
        //unique: true
    },
    reportTypeDes: {
        type: String,
        required: true
    }
});

// ReportTypeSchema.pre('save', async function(next){
//     const rpt = this;
//     console.log(rpt.reportTypeName);
//     const count = await reportTypes.countDocuments();
//     rpt.reportTypeID = 'LH-BC' + String(count + 1).padStart(3,'0');
//     console.log(rpt.reportTypeID);
//     next();
// });

const reportTypes = mongoose.model('reporttypes', ReportTypeSchema);
export default reportTypes;