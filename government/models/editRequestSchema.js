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

EditRequestSchema.pre('save', async function(next){
    const editReq = this;
    const count = await EditRequestSchema.countDocuments();
    editReq.requestID = 'CS' + String(count + 1).padStart(3,'0');
    next();
});

export default mongoose.model("EditRequest", EditRequestSchema);