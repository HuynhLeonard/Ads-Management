import District from "../models/districtSchema.js";

// Done
export const createNewDistrict = async(districtData) => {
    try {
        const data = districtData;
        const districtID = districtData.districtID;
        const existed = await District.findOne({districtID});
        if(!existed){
            const newDistrict = new District(data);
            await newDistrict.save();
            return newDistrict;
        } else {
            return {message: 'District ID has existed'};
        }
    } catch (error) {
        throw new Error('Error happen when creating district.');
    }
};

// Done
export const getDistrictByID = async(districtID) => {
    try {
        const district = await District.find({districtID: districtID});
        
        return district;
    } catch (error) {
        throw new Error('Error happened when finding district.')
    }
};

// Done
export const getAllDistricts = async() => {
    try {
        const districts = await District.find();
        return districts;
    } catch (error) {
        throw new Error('Error happened when finding districts.');
    }
};

// Done
export const updateDistrict = async (districtID, updateData) => {
    try {
        const district = await District.find({districtID: districtID});
        if(!district) {
            throw new Error('District not found.');
        }

        const updatedDistrict = await District.findOneAndUpdate({districtID: districtID}, {$set: updateData}, {new: true});
        return {message: 'District updated successfully'};
    } catch (error) {
        throw new Error('Error updating district.');
    }
};

// Done
export const deleteDistrict = async(districtID) => {
    try {
        
        await District.findOneAndDelete({districtID: districtID});

        return {message: "District delete successfully"};

    } catch (error) {
        throw new Error('Error happened when delete district.');
    }
}