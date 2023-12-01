import AdsCategories from '../models/AdsCategoriesSchema.js';

export const createCategories = async (req,res,next) => {
    try {
        const data = req.body;
        const existed = await AdsCategories.find({CategoriesName: req.body.CategoriesName});
        if(existed.length === 0){
            const newCategory = new AdsCategories(data);
            await newCategory.save();
            res.status(200).json({
                message: 'Category create successfully',
                newCategory
            });
        } else {
            res.status(400).json({
                message: 'Category ID have existed'
            });
        }
    } catch (error) {
        throw new Error('Error happen when creating category.')
    }
};

export const getAllCategories = async (req,res,next) => {
    try {
        const categories = await AdsCategories.find();
        res.status(200).json({
            categories
        });
    } catch (error) {
        throw new Error('Error happened when finding categories.')
    }
};

export const getSingleCategories = async (req,res,next) => {
    try {
        const CategoryID = req.params.id;
        const category = await AdsCategories.find({CategoriesID: CategoryID});
        res.status(200).json({
            CategoryID,
            category
        });
    } catch (error) {
        throw new Error('Error happened when find category.')
    }
};

export const modifyCategories = async (req,res,next) => {
    try {
        const categoryID = req.params.id;
        const category = await AdsCategories.find({CategoriesID: categoryID});
        if(!category){
            throw new Error('District not found.');
        }
        const modifyCategory = await AdsCategories.findOneAndUpdate({CategoriesID: categoryID}, {$set: req.body}, {new: true});
        res.status(200).json({
            modifyCategory
        });
    } catch (error) {
        throw new Error('Error modify category.');
    }
};

export const deleteCategorires = async (req,res,next) => {
    try {
        const categoryID = req.params.id;
        await AdsCategories.findOneAndDelete({CategoriesID: categoryID});
        res.status(200).json({
            message: 'Delete successful.'
        })
    } catch (error) {
        throw new Error('Error happened when delete category.');
    }
};