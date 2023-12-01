import LocationType from '../models/locationTypeSchema.js';

export const createNewLocationType = async (req,res,next) => {
    try {
        const newSpotType = new LocationType(req.body);
        const savedData = await newSpotType.save();

        res.status(200).json({
            savedData
        });
    } catch (error) {
        throw new Error('Error happened when creating new spot Type');
    }
};

export const getLocationType = async (req,res,next) => {
    try {
        const type = await LocationType.find({locationTypeID: req.params.id});

        if(!type) {
            res.status(500).json({
                message: 'Invalid ID'
            });
        } else {
            res.status(200).json({
                type
            })
        }
    } catch (error) {
        throw new Error('Error happened when getting data.');
    }
};

export const getAllLocationType = async (req,res,next) => {
    try {
        const types = await LocationType.find();

        res.status(200).json({
            types
        });
    } catch (error) {
        throw new Error('Error happened when getting data.');
    }
};

export const updateLocationType = async (req,res,next) => {
    try {
        console.log(req.body);
        await LocationType.findOneAndUpdate(
            { locationTypeID: req.params.id },
            { $set: req.body },
        );

        res.status(200).json({
            message: 'Success'
        })
    } catch (error) {
        throw new Error('Error happened when updating data.')
    }
};

export const deleteLocationType = async (req,res,next) => {
    try {
        await LocationType.findOneAndDelete({locationTypeID: req.prarams.id});

        res.status(200).json({
            message: 'Deleting spot type successfully'
        })
    } catch (error) {
        throw new Error('Error Happened when deleting data');
    }
};