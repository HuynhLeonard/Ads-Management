import Location from '../models/locationSchema.js';
import District from '../models/districtSchema.js';
import Ward from '../models/wardSchema.js';

// Contruct this file Done
// Done
export const createNewLocation = async (locationData) => {
    try {
        const newLocation = new Location(locationData);
        const existedDistrict = await District.find({districtID: locationData.districtID});
        const existedWard = await Ward.find({wardID: locationData.wardID});
        
        if(!existedDistrict || !existedWard) {
            return {message: 'Error'};
        } else {
            await newLocation.save();
            return {message: 'Location created successfully'};
        }

    } catch (error) {
        throw new Error('Error happened when creating new Location.')
    }
};

// Done
export const getAllLocation = async () => {
    try {
        const locations = await Location.find();

        return locations;
    } catch (error) {
        throw new Error('Error happened when getting all locations data.');
    }
};

// Done
export const updateLocation = async (locationID,updateData) => {
    try {
        const updatedLocation = await Location.findOneAndUpdate({locationID: locationID}, {$set: updateData});

        return {message: 'Location update successfully'};
    } catch (error) {
        throw new Error('Error happened when update location.')
    }
};

// Done
export const deleteLocation = async (locationID) => {
    try {
        await Location.findOneAndDelete({locationID: locationID});
        return {message: 'Location deleted'};
    } catch (error) {
        throw new Error('Error happened when deleting location');
    }
};

// using locationID
export const getSingleLocation = async (locationID) => {
    try {
        const location = await Location.find({locationID: locationID});

        return location;
    } catch (error) {
        throw new Error('Error');
    }
};

// sort by type (Done)
export const getLocationByType = async (spotType) => {
    try {
        const locations = await Location.find({spotType: spotType});

        return locations;
    } catch (error) {
        throw new Error('Error');
    }
};

// using districtID (Done)
export const getLocationFromDistricts = async (districtID) => {
    try {
        const locations = await Location.findOne({districtID: districtID});

        return locations;
    } catch (error) {
        throw new Error('Error');
    }
};

// using wardID
export const getLocationFromWard = async (wardID) => {
    try {
        const locations = await Location.findOne({wardID: wardID});
        
        return locations
    } catch (error) {
        throw new Error('Error')
    }
};

// count all place
export const countAll = async () => {
    try {
        const countDoc = await Location.countDocuments();
        return countDoc
    } catch (error) {
        throw new Error('Error');
    }
};

// Done
export const countByDistrict = async (districtID) => {
    try {
        const countDoc = await location.countDocuments({districtID: districtID});
        return countDoc;
    } catch (error) {
        throw new Error('Error');
    }
}