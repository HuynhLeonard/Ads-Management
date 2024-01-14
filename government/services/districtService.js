import District from "../models/districtSchema.js";

// Done
export const createNewDistrict = async(districtData) => {
    try {
        await District.create(data);
        return { message: 'District created successfully' };
    } catch (error) {
        throw new Error('Error happen when creating district.');
    }
};

// Done
export const getDistrictByID = async(districtID) => {
    try {
        const district = await District.findOne({districtID: districtID});
        
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
};

export const getIDByName = async (districtName) => {
    try {
        const district = await District.findOne({districtName: districtName});

        if(!district) {
            return null
        }

        return district.districtID;
    } catch (error) {
        throw new Error('Error getting data.')
    }
}