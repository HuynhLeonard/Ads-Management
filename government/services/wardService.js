import Ward from '../models/wardSchema.js';
import District from '../models/districtSchema.js';

export const createNewWard = async(req,res,next) => {
    try {   
        const existedDistrict = await District.findOne({districtID: req.body.districtID});
        if(existedDistrict) {
            const existedWard = await Ward.findOne({wardID: req.body.wardID});
            if(!existedWard) {
                const savedWard = new Ward(req.body);
                await savedWard.save();
                res.status(200).json({
                    message: 'success',
                    savedWard
                })
            } else {
                res.status(400).json({
                    message: 'WardID have already existed'
                })
            }
        } else {
            res.status(400).json({
                message: 'District not existed.'
            })
        }
    } catch (error) {
        throw new Error('Error happened when create ward!');
    }
};

export const getWard = async (req,res,next) => {
    try {
        const ward = await Ward.findOne({wardID: req.body.wardID});
        if(!ward) {
            res.status(400).json({
                message: 'Ward ID not existed!'
            })
        }
        res.status(200).json({
            ward
        })
    } catch (error) {
        throw new Error('Error happended when get ward!');
    }
};

export const getAllWard = async(req,res,next) => {
    try {
        const wards = await Ward.find();
        res.status(200).json({
            wards
        })
    } catch (error) {
        
    }
};

export const getWardOfDistrict = async(req,res,next) => {
    try {
        const wards = await Ward.findOne({districtID: req.params.districtID});
        res.status(200).json({
            wards
        })
    } catch (error) {
        throw new Error('Error happened when getting ward.');
    }
};

export const updateWard = async (req,res,next) => {
    try {
        const wards = await Ward.findOneAndUpdate({wardID: req.params.wardID}, {$set: req.body});
        res.status(200).json({
            message: "Ward update successfully",
        });
    } catch (error) {
        throw new Error('Error happened when update ward.');
    }
};

// add delete (delete by Id and all in district)