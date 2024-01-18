import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    expiredTime: {
        type: Date,
        required: true
    }
});

const OTP = mongoose.model('otps', OTPSchema);
export default OTP;
