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

boardSchema.pre('save', async function(next){
    const boa = this;
    const count = await boardSchema.countDocuments();
    boa.boardID = 'QC' + String(count + 1).padStart(3,'0');
    next();
});


export default mongoose.model('Board', boardSchema);