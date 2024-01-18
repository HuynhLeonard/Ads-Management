import LicensingRequest from '../models/licensingSchema.js';

export const createLicense = async (data) => {
  try {
    console.log(data);
    const newRequest = new LicensingRequest(data);
    await newRequest.save();
    return { message: 'Licensing request created successfully' };
  } catch (error) {
    throw new Error(`Error creating licensing request: ${error.message}`);
  }
};

export const updateLicenseRequest = async (id, newData) => {
  try {
    await LicensingRequest.findOneAndUpdate(
      { requestID:  id },
      { $set: newData },
    );
    return { message: 'Licensing request updated successfully' };
  } catch (error) {
    throw new Error(`Error updating licensing request by ID: ${error.message}`);
  }
};

export const deleteLicenseRequest = async (id) => {
  // console.log(id);
  try {
    await LicensingRequest.findOneAndDelete({ requestID: id });
    return { message: 'Licensing request deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting licensing request by ID: ${error.message}`);
  }
};

export const getAllRequest = async () => {
  try {
    return await LicensingRequest.find();
  } catch (error) {
    throw new Error(`Error getting all licensing requests: ${error.message}`);
  }
};

export const getRequestByUsername = async (username) => {
  try {
    return await LicensingRequest.find({ officer: username });
  } catch (error) {
    throw new Error(`Error getting licensing requests by username ${username}: ${error.message}`);
  }
}

export const getSingleRequest = async (id) => {
  try {
    return await LicensingRequest.findOne({ requestID: id });
  } catch (error) {
    throw new Error(`Error getting licensing request by ID: ${error.message}`);
  }
};

export const getRequestByObjectID = async (objectID) => {
  try {
    return await LicensingRequest.find({ objectID });
  } catch (error) {
    throw new Error(`Error getting licensing requests by objectID: ${error.message}`);
  }
};

export const getRequestByStatus = async (status) => {
  try {
    return await LicensingRequest.find({ status });
  } catch (error) {
    throw new Error(`Error getting licensing requests by status: ${error.message}`);
  }
};
