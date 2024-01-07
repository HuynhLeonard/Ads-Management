import * as apiService from "../../services/apiService.js";

export const getAllLocations = async (districtID,wardID) => {
    try {
        return await apiService.getAllLocations(districtID, wardID);
    } catch (error) {
        throw new Error('Error!')
    }
};

export const getDetailLocation = async (locationID) => {
    try {
        // test
        const a = await apiService.getLocationDetail(locationID);
        console.log(a);
        return await apiService.getLocationDetail(locationID);
    } catch (error) {
        throw new Error('Error getting data of detail location.')
    }
}