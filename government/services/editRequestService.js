import EditRequest from "../models/editRequestSchema.js";

export const createRequest = async (data) => {
    try {
        const newEditRequest = new EditRequest(data);
        await newEditRequest.save();
        return {message: 'Edit request created successfully'}
    } catch (error) {
        throw new Error('Error happen when creating.')
    }
};

export const updateRequest = async (requestID, updateData) => {
    try {
        await EditRequest.findOneAndUpdate({requestID}, {$set: updateData});
        return {message: 'Edit request updated successfully'}
    } catch (error) {
        throw new Error("Error");
    }
};

export const deleteByID = async (requestID) => {
    try {
        await EditRequest.findOneAndDelete({ requestID });
        return { message: 'Edit request deleted successfully' };
    } catch (error) {
        throw new Error(`Error deleting edit request by ID: ${error.message}`);
    }
};

export const getAllRequest = async () => {
    try {
        const data = await EditRequest.find();
        return data;
    } catch (error) {
        throw new Error(`Error deleting edit request by ID: ${error.message}`);
    }
};

export const getSingleRequest = async (requestID) => {
    try {
        const data = await EditRequest.find({requestID});
        return data;
    } catch (error) {
        throw new Error(`Error deleting edit request by ID: ${error.message}`);
    }
}

export const getByBoardID = async (objectID) => {
    try {
        const data = await EditRequest.find({objectID});
        return data;
    } catch (error) {
        throw new Error(`Error deleting edit request by ID: ${error.message}`);
    }
};

export const getByStatus = async (status) => {
    try {
        const data = await EditRequest.find({status});
        return data;
    } catch (error) {
        throw new Error(`Error deleting edit request by ID: ${error.message}`);
    }
};