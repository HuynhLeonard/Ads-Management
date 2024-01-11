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

export const updatePasswordByUsername = async (username, newPassword) => {
    try {
        await User.findOneAndUpdate({username}, {$set: {password: newPassword}});

        return {message: 'Update password    successfully'};
    } catch (error) {
        throw new Error('Error');
    }
};

export const deleteUserByUsername = async (username) => {
    try {
        await User.findOneAndDelete({username});
        return {message: 'Officer deleted successfully'};
    } catch (error) {
        throw new Error('Error deleting officer');
    }
}

export const updateOfficer = async (username, updateData) => {
    try {
        await User.findOneAndUpdate({username}, {$set: updateData});
        return {message: 'Officer updated successfully'};
    } catch (error) {
        throw new Error('Error');
    }
};

export const getSingleUser = async (username, onlyinfo = false) => {
    try {
        if(onlyinfo) {
            return User.findOne({username}, {password: 0});
        }
        return User.findOne({username});
    } catch (error) {
        throw new Error('Error');
    }
};

export const getOfficerByEmail = async (email) => {
    try {
        return await User.findOne({email});
    } catch (error) {
        throw new Error('Error getting officer');
    }
}

// 1: district
// 2: ward officer
// 0: not assigned
//-1: get all
export const getAllOfficer = async (position = -1) => {
    const option = [
        {
            $match: {
                username: {$ne: 'admin'},
                position: {$ne: -1}
            }
        },
        {
            $lookup: {
                from: 'districts',
                localField: 'districtID',
                foreignField: 'districtID',
                as: 'district'
            }
        },
        {
            $lookup: {
                from: 'wards',
                localField: 'wardID',
                foreignField: 'wardID',
                as: 'ward'
            }
        },
        {
            $unwind: {
                path: '$district',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$ward',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                username: 1,
                email: 1,
                position: 1,
                districtID: 1,
                wardID: 1,
                districtName: '$district.districtName',
                wardName: '$ward.wardName'
            }
        }
    ];
    try {
        if(position === -1) {
            return await User.aggregate(option);
        } else if(position < 3) {
            const matchOptions = {position};
            return await User.aggregate([...option, {$match: matchOptions}]);
        } else {
            throw new Error('Invalid position')
        }
    } catch (error) {
        throw new Error('Error getting all officers');
    }
};

export const getOfficerFromDistrict = async (districtID) => {
    try {
        return await User.find({districtID});
    } catch (error) {
        throw new Error('Error');
    }
};

export const getOfficerFromWard = async (wardID) => {
    try {
        return await User.find({wardID});
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

export const getRoleByUsername = async (username) => {
    try {
        const officer = await User.findOne({username});
        
        if(!officer) {
            return 'Officer not found';
        }

        if(officer.position === 0 || officer.position === 1) {
            return officer.districtID;
        } else if(officer.position === 2) {
            return officer.wardID;
        } else {
            return 'Invalid position.';
        } 
    } catch (error) {
        return 'Error getting role.'
    }
}

