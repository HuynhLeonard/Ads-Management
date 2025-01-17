    import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    locationID: {
        type: String,
        required: true,
        unique: true
    },
    locationName: {
        type: String,
        required: true
    },
    locationType: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    districtID: {
        type: String,
        required: true
    },
    wardID: {
        type: String,
        required: true
    },
    adsForm: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        // required: true
    },
    planned: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

// LocationSchema.pre('save', async function(next){
//     const location = this;
//     const count = await LocationSchema.countDocuments();
//     location.locationID = 'LC' + String(count + 1).padStart(3,'0');
//     next();
// });

const Location = mongoose.model('locations', LocationSchema);
export default Location;