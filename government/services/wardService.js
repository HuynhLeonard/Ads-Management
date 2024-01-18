import Ward from '../models/wardSchema.js';
import District from '../models/districtSchema.js';

// Done
export const createNewWard = async(wardData) => {
    try {
        const newWard = new Ward(wardData)
        await newWard.save()
        return { message: 'Ward created successfully' }
    } catch (error) {
        throw new Error(`Error creating ward: ${error.message}`)
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
        const wards = await Ward.find({districtID: districtID});
        
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

export const getIDByName = async (wardName) => {
    try {
        const ward = await Ward.findOne({ wardName }, { _id: 0, wardID: 1 })
        if (!ward) {
            return null
        }
        return ward.wardID
    } catch (error) {
        throw new Error(`Error getting ward by name: ${error.message}`)
    }
}