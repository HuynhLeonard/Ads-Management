import Location from '../models/locationSchema.js';
import District from '../models/districtSchema.js';
import Ward from '../models/wardSchema.js';

export const createNewLocation = async (req,res,next) => {
    try {
        const newLocation = new Location(req.body);
        const existedDistrict = await District.find({districtID: req.body.districtID});
        const existedWard = await Ward.find({wardID: req.body.wardID});
        
        if(!existedDistrict || !existedWard) {
            res.status(400).json({
                message: 'Error'
            })
        } else {
            await newLocation.save();
            res.status(200).json({
                newLocation
            });
        }

    } catch (error) {
        throw new Error('Error happened when creating new Location.')
    }
};

export const getAllLocation = async (req,res,next) => {
    try {
        const locations = await Location.find();

        res.status(200).json({
            locations
        })
    } catch (error) {
        throw new Error('Error happened when getting all locations data.');
    }
};

export const updateLocation = async (req,res,next) => {
    try {
        const updatedLocation = await Location.findOneAndUpdate({locationID: req.params.id}, {$set: req.body});

        res.status(200).json({
            message: 'Location update successfully'
        })
    } catch (error) {
        throw new Error('Error happened when update location.')
    }
};

export const deleteLocation = async (req,res,next) => {
    try {
        await Location.findOneAndDelete({locationID: req.params.id});
        res.status(200).json({
            message: 'Location deleted successfully'
        })
    } catch (error) {
        throw new Error('Error happened when deleting location');
    }
};

// using locationID
export const getSingleLocation = async (req,res,next) => {
    try {
        const location = await Location.findOne({locationID: req.params.locationID});

        res.status(200).json({
            location
        })
    } catch (error) {
        throw new Error('Error');
    }
};

// sort by type
export const getLocationByType = async (req,res,next) => {
    try {
        const locations = await Location.find({spotType: req.params.spotType});

        res.status(200).json({
            location
        });
    } catch (error) {
        throw new Error('Error');
    }
};

// using districtID
export const getLocationFromDistricts = async (req,res,next) => {
    try {
        const locations = await Location.findOne({districtID: req.params.districtID});

        res.status(200).json({
            locations
        });
    } catch (error) {
        throw new Error('Error');
    }
};

// using wardID
export const getLocationFromWard = async (req,res,next) => {
    try {
        const locations = await Location.findOne({wardID: req.params.wardID});
        res.status(200).json({
            locations
        });
    } catch (error) {
        throw new Error('Error')
    }
};

// count all place
export const countAll = async (req,res,next) => {
    try {
        const countDoc = await Location.countDocuments();
        res.status(200).json({
            countDoc
        })
    } catch (error) {
        throw new Error('Error');
    }
};

export const countByDistrict = async (req,res,next) => {
    try {
        const countDoc = await location.countDocuments({districtID: req.params.districtID});
        res.status(200).json({
            countDoc
        })
    } catch (error) {
        throw new Error('Error');
    }
}