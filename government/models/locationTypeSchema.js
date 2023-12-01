import mongoose from "mongoose";

const locationTypeSchema = new mongoose.Schema({
    locationTypeID: {
        type: String,
        required: true,
        unique: true
    },
    locationTypeName: {
        type: String,
        required: true
    }
});

export default mongoose.model('LocationTypes', locationTypeSchema);