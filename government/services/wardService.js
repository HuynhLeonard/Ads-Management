import Ward from '../models/wardSchema.js';
import District from '../models/districtSchema.js';

// Done
export const createNewWard = async(wardData) => {
    try {   
        const existedDistrict = await District.find({districtID: wardData.districtID});
        if(existedDistrict) {
            const existedWard = await Ward.find({wardID: wardData.wardID});
            if(!existedWard) {
                const savedWard = new Ward(req.body);
                await savedWard.save();
                return savedWard;
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

// Done
export const getWard = async (wardID) => {
    try {
        const ward = await Ward.findOne({wardID: wardID});
        if(!ward) {
            return {
                message: 'Ward ID not existed!'
            };
        }
        
        return ward;
    } catch (error) {
        throw new Error('Error happended when get ward!');
    }
};

export const getAllWard = async() => {
    try {
        const wards = await Ward.find();
        return wards;
    } catch (error) {
        throw new Error('Error happended when get ward!');
    }
};

export const getWardOfDistrict = async(districtID) => {
    try {
        const wards = await Ward.findOne({districtID: districtID});
        
        return wards;
    } catch (error) {
        throw new Error('Error happened when getting ward.');
    }
};

export const updateWard = async (wardID, updatedData) => {
    try {
        const wards = await Ward.findOneAndUpdate({wardID: wardID}, {$set: updatedData});
        return {
            message: "Ward update successfully",
        }
    } catch (error) {
        throw new Error('Error happened when update ward.');
    }
};

// add delete (delete by Id and all in district)
export const deleteWard = async (wardID) => {
    try {
        await Ward.findOneAndDelete({wardID: wardID});

        return {message: 'Delete ward successfully'};
    } catch (error) {
        throw new Error('Error happened.')
    }
}


// add all
export const countAll = async () => {
    try {
        const count = await Ward.countDocuments();
        return count;
    } catch (error) {
        throw new Error('Error happened')
    }
};

export const countAllOfDistrict = async (districtID) => {
    try {
        const count = Ward.countDocuments({districtID: districtID});
        
        return count;
    } catch (error) {
        throw new Error(`Error get wards of count documents: ${error.message}`)
    }
};