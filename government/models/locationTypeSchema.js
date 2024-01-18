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

locationTypeSchema.pre('save', async function(next){
    const locationType = this;
    const count = await locationTypeSchema.countDocuments();
    locationType.locationTypeID = 'LCT' + String(count + 1).padStart(3,'0');
    next();
});

export default mongoose.model('LocationTypes', locationTypeSchema);