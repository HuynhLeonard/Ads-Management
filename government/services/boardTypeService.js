import BoardType from "../models/boardTypeSchema.js";

export const createBoardType = async (req,res,next) => {
    try {
        const newData = new BoardType(req.body);

        const savedData = await newData.save();
        res.status(200).json({
            savedData
        })
    } catch (error) {
        throw new Error('Error')
    }
};

export const getSingleBoardType = async (req,res,next) => {
    try {
        const boardType = await BoardType.find({boardTypeID: req.params.id});

        if(!boardType) {
            res.status(500).json({
                message: 'Invalid ID'
            })
        } else {
            res.status(200).json({
                boardType
            })
        }

    } catch (error) {
        throw new Error('Error');
    }
};

export const getAllBoardType = async (req,res,next) => {
    try {
        const boardTypes = await BoardType.find();

        res.status(200).json({
            boardTypes
        })
    } catch (error) {
        throw new Error('Error');
    }
};

export const updateBoardType = async (req,res,next) => {
    try {
        const updatedBoardType = await BoardType.findOneAndUpdate({boardTypeID: req.params.id}, {
            $set: req.body
        });

        res.status(200).json({
            updatedBoardType
        });
    } catch (error) {
        throw new Error('Error');
    }
};

export const deleteBoardType = async (req,res,next) => {
    try {
        await BoardType.findOneAndDelete({
            boardTypeID: req.params.id
        })
    } catch (error) {
        throw new Error('Error');
    }
};