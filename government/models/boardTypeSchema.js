import mongoose from "mongoose";

const boardTypeSchema = new mongoose.Schema({
    boardTypeID: {
        type: String,
        required: true,
        unique: true
    },
    typeName: {
        type: String,
        required: true
    }
});

export default mongoose.model('BoardType', boardTypeSchema);