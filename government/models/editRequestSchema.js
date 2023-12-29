import mongoose from "mongoose";

const EditRequestSchema = new mongoose.Schema({
    requestID: {
        type: String,
        required: true,
        unique: true
    },
    requestTime: {
        type: Date,
        required: true
    },
    // check this name here again
    objectID: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        // 1-confirm, 2 - on processing, 3 - done
        type: Number,
        required: true
    },
    editContent: {
        type: Object,
        required: true
    },
    officer: {
        type: String,
        required: true
    }
});

export default mongoose.model("EditRequest", EditRequestSchema);