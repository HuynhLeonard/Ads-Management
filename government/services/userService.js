import cors from 'cors';
import User from '../models/user.js';
import {comparePassword, hashPassword} from '../services/passwordService.js';

export const createUser = async (userData) => {
    try {
        const newUser = new User(userData);

        newUser.password = await hashPassword(newUser.password);

        await newUser.save();

        return newUser;
        // return {message: 'User created successfully'};
    } catch (error) {
        throw new Error('Error');
    }
};

export const updatePassword = async (username, newPassword) => {
    try {
        await User.findOneAndUpdate({username}, {$set: {password: newPassword}});

        return {message: 'Create user successfully'};
    } catch (error) {
        throw new Error('Error');
    }
};

export const updateOfficer = async (username, updateData) => {
    try {
        
    } catch (error) {
        throw new Error('Error');
    }
};

export const getSingleUser = async (username) => {
    try {
        const user = user.findOne({username});
        return user;
    } catch (error) {
        throw new Error('Error');
    }
};

export const getAllOfficer = async () => {
    try {
        
    } catch (error) {
        throw new Error('Error');
    }
};

export const getOfficerFromDistrict = async (districtID) => {
    try {
        
    } catch (error) {
        throw new Error('Error');
    }
};

export const getOfficerFromWard = async (wardID) => {
    try {
        
    } catch (error) {
        throw new Error('Error');
    }
};

export const getUserUsingGoogleID = async (googleID) => {
    try {
        const user = await User.findOne({googleID: googleID});
        return user;
    } catch (error) {
        throw new Error('Error');
    }
};

