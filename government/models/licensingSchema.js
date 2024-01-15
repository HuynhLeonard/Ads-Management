import mongoose from 'mongoose';

const LicensingShema = new mongoose.Schema({
    requestID: {
        type: String,
        unique: true
    },
    locationID: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        rquired: true
    },
    boardType: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    companyEmail: {
        type: String,
        required: true
    },
    companyAddress: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        // 1,2,3 the same as edit request
        type: Number,
        required: true
    },
    officer: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    // gia hạn giấy phép
    extendForBoard: {
        type: String,
    }
});

LicensingShema.pre('save', async function(next){
    const license = this;
    const count = await LicensingShema.countDocuments();
    license.requestID = 'LS' + String(count + 1).padStart(3,'0');
    next();
});

export default mongoose.model("LicensingRequest", LicensingShema);