import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
    districtID: {
        type: String,
        required: true,
        unique: true
    },
    districtName: {
        type: String,
        required: true
    }
});

export default mongoose.model('Districts', districtSchema);