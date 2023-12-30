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
        const option = [
            {
                $lookup: {
                    from: "districts",
                    localField: "districtID",
                    foreignField: "districtID",
                    as: "district",
                }
            },
            {
                $unwind: {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "wards",
                    localField: "wardID",
                    foreignField: "wardID",
                    as: "ward"
                }
            },
            {
                $unwind: {
                    path: "$ward",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "locationtypes",
                    localField: "locationType",
                    foreignField: "locationTypeID",
                    as: "locationtype"
                }
            },
            {
                $unwind: {
                    path: "$locationtype",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "adscategories",
                    localField: "adsForm",
                    foreignField: "CategoriesID",
                    as: "adscategory"
                }
            },
            {
                $unwind: {
                    path: "$adscategory",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    adsForm: 1,
                    address: 1,
                    districtID: 1,
                    wardID: 1,
                    locationID: 1,
                    locationName: 1,
                    locationType: 1,
                    latitude: 1,
                    longitude: 1,
                    planned: 1,
                    districtName: "$district.districtName",
                    wardName: "$ward.wardName",
                    locationtypeName: "$locationtype.locationTypeName",
                    adsFormName: "$adscategory.CategoriesName"
                }
            },
            {
                $sort: {
                    locationID: 1
                }
            },
        ]

        return await Location.aggregate(option);
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
        const option = [
            {
                $match: {
                    locationID: locationID
                }
            },
            {
                $lookup: {
                    from: "districts",
                    localField: "districtID",
                    foreignField: "districtID",
                    as: "district",
                }
            },
            {
                $unwind: {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "wards",
                    localField: "wardID",
                    foreignField: "wardID",
                    as: "ward"
                }
            },
            {
                $unwind: {
                    path: "$ward",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "locationtypes",
                    localField: "locationType",
                    foreignField: "locationTypeID",
                    as: "locationtype"
                }
            },
            {
                $unwind: {
                    path: "$locationtype",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "adscategories",
                    localField: "adsForm",
                    foreignField: "CategoriesID",
                    as: "adscategory"
                }
            },
            {
                $unwind: {
                    path: "$adscategory",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    wardID: "P0101",
                    locationType: "LCT06",
                    adsForm: "HT001"
                }
            },
            {
                $project: {
                    _id: 0,
                    adsForm: 1,
                    address: 1,
                    districtID: 1,
                    wardID: 1,
                    locationID: 1,
                    locationName: 1,
                    locationType: 1,
                    planned: 1,
                    districtName: "$district.districtName",
                    wardName: "$ward.wardName",
                    locationtypeName: "$locationtype.locationTypeName",
                    adsFormName: "$adscategory.CategoriesName",
                    images: 1,
                    longitude: 1,
                    latitude: 1
                }
            },
            {
                $sort: {
                    locationID: 1
                }
            },
        ]

        const data = await Location.aggregate(option);
        return data[0];
    } catch (error) {
        throw new Error('Error');
    }
};

// sort by type (Done)
export const getLocationByType = async (spotType) => {
    try {
        return await Location.find({spotType: spotType});
    } catch (error) {
        throw new Error('Error');
    }
};

export const getLocationByPlanned = async (planned) => {
    try {
        return await Location.find({planned: planned});
    } catch (error) {
        throw new Error('Error');
    }
}

// using districtID (Done)
export const getLocationFromDistricts = async (districtID) => {
    try {
        const option = [
            {
                $match: {
                    districtID: districtID
                }
            },
            {
                $lookup: {
                    from: "districts",
                    localField: "districtID",
                    foreignField: "districtID",
                    as: "district",
                }
            },
            {
                $unwind: {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "wards",
                    localField: "wardID",
                    foreignField: "wardID",
                    as: "ward"
                }
            },
            {
                $unwind: {
                    path: "$ward",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "locationtypes",
                    localField: "locationType",
                    foreignField: "locationTypeID",
                    as: "locationtype"
                }
            },
            {
                $unwind: {
                    path: "$locationtype",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "adscategories",
                    localField: "adsForm",
                    foreignField: "CategoriesID",
                    as: "adscategory"
                }
            },
            {
                $unwind: {
                    path: "$adscategory",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    wardID: "P0101",
                    locationType: "LCT06",
                    adsForm: "HT001"
                }
            },
            {
                $project: {
                    _id: 0,
                    adsForm: 1,
                    address: 1,
                    districtID: 1,
                    wardID: 1,
                    locationID: 1,
                    locationName: 1,
                    locationType: 1,
                    planned: 1,
                    districtName: "$district.districtName",
                    wardName: "$ward.wardName",
                    locationtypeName: "$locationtype.locationTypeName",
                    adsFormName: "$adscategory.CategoriesName",
                    images: 1,
                }
            },
            {
                $sort: {
                    locationID: 1
                }
            },
        ]

        return await Location.aggregate(option);
    } catch (error) {
        throw new Error('Error');
    }
};

// using wardID
export const getLocationFromWard = async (wardID) => {
    try {
        const option = [
            {
                $match: {
                    wardID: wardID
                }
            },
            {
                $lookup: {
                    from: "districts",
                    localField: "districtID",
                    foreignField: "districtID",
                    as: "district",
                }
            },
            {
                $unwind: {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "wards",
                    localField: "wardID",
                    foreignField: "wardID",
                    as: "ward"
                }
            },
            {
                $unwind: {
                    path: "$ward",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "locationtypes",
                    localField: "locationType",
                    foreignField: "locationTypeID",
                    as: "locationtype"
                }
            },
            {
                $unwind: {
                    path: "$locationtype",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "adscategories",
                    localField: "adsForm",
                    foreignField: "CategoriesID",
                    as: "adscategory"
                }
            },
            {
                $unwind: {
                    path: "$adscategory",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    wardID: "P0101",
                    locationType: "LCT06",
                    adsForm: "HT001"
                }
            },
            {
                $project: {
                    _id: 0,
                    adsForm: 1,
                    address: 1,
                    districtID: 1,
                    wardID: 1,
                    locationID: 1,
                    locationName: 1,
                    locationType: 1,
                    planned: 1,
                    districtName: "$district.districtName",
                    wardName: "$ward.wardName",
                    locationtypeName: "$locationtype.locationTypeName",
                    adsFormName: "$adscategory.CategoriesName",
                    images: 1,
                }
            },
            {
                $sort: {
                    locationID: 1
                }
            },
        ]

        return await Location.aggregate(option);
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
        return location.countDocuments({districtID: districtID});
    } catch (error) {
        throw new Error('Error');
    }
};

export const countByWard = async (wardID) => {
    try {
        return Location.countDocuments({wardID: wardID});
    } catch (error) {
        throw new Error('Error');
    }
};

export const getAdsCategoryByID = async (locationID) => {
    try {
        const option = [
            {
                $match: {
                    locationID: locationID
                }
            },
            {
                $lookup: {
                    from: 'adscategory',
                    localField: 'adsForm',
                    foreignField: 'formID',
                    as: 'adsform'
                }
            },
            {
                $project: {

                }
            }
        ]
    } catch (error) {
        throw new Error(error);
    }
}