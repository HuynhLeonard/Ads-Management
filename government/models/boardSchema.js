import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    boardID: {
        type: String,
        required: true,
        unique: true
    },
    boardModelType: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    locationID: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    licenseNumber: {
        type: String,
    }
});

export default mongoose.model('Board', boardSchema);