import OTP from '../models/otpSchema.js';
import emailService from "./emailService.js";

export const saveOTP = async (email, otp) => {
    try {
        const expiredTime = new Date();
        expiredTime.setMinutes(expiredTime.getMinutes() + 2);
        await OTP.create({email,otp,expiredTime});
    } catch (error) {
        throw new Error('Error saving OTP.');
    }
};

export const getSingleOTP = async (email) => {
    try {
        const otp = await OTP.findOne({email}).sort({expiredTime: -1});
        if(otp.expiredTime < new Date()) {
            return null;
        }
        return otp;
    } catch (error) {
        throw new Error('Error getting OTP.');
    }
};

export const sendOTP = async (email, otp) => {
    try {
        await emailService.sendOTP(email,otp);
    } catch (error) {
        throw new Error('Error sending OTP.')
    }
}