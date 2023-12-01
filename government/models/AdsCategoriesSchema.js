import mongoose from "mongoose";

const AdsCategoriesSchema = new mongoose.Schema({
    CategoriesID: {
        type: String,
        unique: true
    },
    CategoriesName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
});

// create id for this one
AdsCategoriesSchema.pre('save', async function(next){
    const adsCat = this;
    const count = await AdsCategories.countDocuments();
    adsCat.CategoriesID = 'HT' + String(count + 1).padStart(3,'0');
    next();
});
const AdsCategories = mongoose.model('AdsCategories', AdsCategoriesSchema);

export default AdsCategories