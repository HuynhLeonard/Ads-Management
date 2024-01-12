import AdsCategories from '../models/AdsCategoriesSchema.js';

// Done
export const createCategories = async (newData) => {
    try {
        const data = newData;
        const existed = await AdsCategories.find({CategoriesName: data.CategoriesName});
        if(existed.length === 0){
            const newCategory = new AdsCategories(data);
            await newCategory.save();
            
            return { message: 'Ads form created successfully' };
        } else {
            return {message: 'Message create successfully'};
        }
    } catch (error) {
        throw new Error('Error happen when creating category.')
    }
};

// Done
export const getAllCategories = async () => {
    try {
        return await AdsCategories.find();
    } catch (error) {
        throw new Error('Error happened when finding categories.')
    }
};

// Done
export const getSingleCategories = async (CategoriesID) => {
    try {
        const category = await AdsCategories.find({CategoriesID: CategoriesID});
        return category;
    } catch (error) {
        throw new Error('Error happened when find category.')
    }
};

// Done
export const modifyCategories = async (CategoriesID, updateData) => {
    try {
        const category = await AdsCategories.find({CategoriesID: CategoriesID});
        if(!category){
            throw new Error('District not found.');
        }
        const modifyCategory = await AdsCategories.findOneAndUpdate({CategoriesID: CategoriesID}, {$set: updateData}, {new: true});
        return {message: 'Categories updated successfully'};
    } catch (error) {
        throw new Error('Error modify category.');
    }
};

export const deleteCategorires = async (id) => {
    try {
        await AdsCategories.findOneAndDelete({CategoriesID: id});
        return {message: 'Categories deleted successfully'};
    } catch (error) {
        throw new Error('Error happened when delete category.');
    }
};


export const check = (req,res,next) => {

}