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

boardTypeSchema.pre('save', async function(next){
    const boaTy = this;
    const count = await boardTypeSchema.countDocuments();
    boaTy.boardTypeID = 'LB' + String(count + 1).padStart(3,'0');
    next();
});

export default mongoose.model('BoardType', boardTypeSchema);