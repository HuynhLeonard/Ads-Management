import District from "../models/districtSchema.js";

export const createNewDistrict = async(req,res,next) => {
    try {
        const data = req.body;
        const districtID = req.body.districtID;
        const existed = await District.findOne({districtID});
        if(!existed){
            const newDistrict = new District(data);
            await newDistrict.save();
            res.status(200).json({
                message: 'District create sucessfully',
                newDistrict
            })
        } else {
            res.status(400).json({
                message: 'District ID have existed'
            });
        }
    } catch (error) {
        throw new Error('Error happen when creating district.');
    }
};

export const getDistrictByID = async(req,res,next) => {
    try {
        const districtID = req.params.id;
        const district = await District.findOne({districtID});
        res.status(200).json({
            districtID,
            district
        });
    } catch (error) {
        throw new Error('Error happened when finding district.')
    }
};

export const getAllDistricts = async(req,res,next) => {
    try {
        const districts = await District.find();
        res.status(200).json({
            districts
        });
    } catch (error) {
        throw new Error('Error happened when finding districts.');
    }
};

export const updateDistrict = async (req,res,next) => {
    try {
        const districtID = req.params.id;
        const district = await District.findOne({districtID});
        if(!district) {
            throw new Error('District not found.');
        }

        const updatedDistrict = await District.findOneAndUpdate({districtID}, {$set: req.body}, {new: true});
        res.status(200).json({
            updatedDistrict
        })
    } catch (error) {
        throw new Error('Error updating district.');
    }
};

export const deleteDistrict = async(req,res,next) => {
    try {
        const districtID = req.params.id;
        const deleteDistrict = await District.findOneAndDelete({districtID});
    } catch (error) {
        throw new Error('Error happened when delete district.');
    }
}