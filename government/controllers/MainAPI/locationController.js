import * as apiService from "../../services/apiService.js";

export const getAllLocations = async (districtID,wardID) => {
    try {
        return await apiService.getAllLocations(districtID, wardID);
    } catch (error) {
        throw new Error('Error!')
    }
}