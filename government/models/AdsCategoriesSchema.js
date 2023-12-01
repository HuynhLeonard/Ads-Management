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
AdsCategoriesSchema.pre('save', async function(){
    const adsCat = this;
    const count = await adsCat.countDocument();
    adsCat.CategoriesID = 'H' + String(count + 1).padStart(3,'0');
    next();
})

export default mongoose.model('AdsCategories', AdsCategoriesSchema);