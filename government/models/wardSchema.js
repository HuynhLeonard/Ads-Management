import mongoose from "mongoose";

const wardSchema = new mongoose.Schema({
    wardID: {
        type: String,
        required: true,
        unique: true
    },
    wardName: {
        type: String,
        required: true
    },
    districtID: {
        type: String,
        required: true
    }
});

export default mongoose.model('Wards', wardSchema);