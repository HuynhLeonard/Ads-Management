import LocationType from '../models/locationTypeSchema.js';

// Done
export const createNewLocationType = async (locationTypeData) => {
    try {
        const newSpotType = new LocationType(locationTypeData);
        const savedData = await newSpotType.save();

        return savedData;
    } catch (error) {
        throw new Error('Error happened when creating new spot Type');
    }
};

// Done
export const getLocationType = async (locationTypeID) => {
    try {
        const type = await LocationType.find({locationTypeID: locationTypeID});

        if(!type) {
            return {message: 'Invalid ID'}
        } else {
            return type;
        }
    } catch (error) {
        throw new Error('Error happened when getting data.');
    }
};

// Done
export const getAllLocationType = async () => {
    try {
        const types = await LocationType.find();

        return types;
    } catch (error) {
        throw new Error('Error happened when getting data.');
    }
};

// Done
export const updateLocationType = async (locationTypeID, updateData) => {
    try {
        console.log(req.body);
        await LocationType.findOneAndUpdate(
            { locationTypeID: locationTypeID },
            { $set: updateData },
        );

        return {message: 'Update Type Successfully'};
    } catch (error) {
        throw new Error('Error happened when updating data.')
    }
};

// Done
export const deleteLocationType = async (locationTypeID) => {
    try {
        await LocationType.findOneAndDelete({locationTypeID: locationTypeID});

        return { message: 'Deleting spot type successfully' }
    } catch (error) {
        throw new Error('Error Happened when deleting data');
    }
};