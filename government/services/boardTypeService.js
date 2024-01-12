import BoardType from "../models/boardTypeSchema.js";

// Done
export const createBoardType = async (boardTypeData) => {
    try {
        const newData = new BoardType(boardTypeData);

        await newData.save();
        return { message: 'Board type created successfully' };
    } catch (error) {
        throw new Error('Error')
    }
};

// Done
export const getSingleBoardType = async (boardTypeID) => {
    try {
        const boardType = await BoardType.find({boardTypeID: boardTypeID});

        if(!boardType) {
            return {message: 'Invalid ID'};
        } else {
            return boardType;
        }

    } catch (error) {
        throw new Error('Error');
    }
};

// Done
export const getAllBoardType = async () => {
    try {
        const boardTypes = await BoardType.find().sort({boardTypeID: 1});

        return boardTypes;
    } catch (error) {
        throw new Error('Error');
    }
};

// Done
export const updateBoardType = async (boardTypeID, updateData) => {
    try {
        const updatedBoardType = await BoardType.findOneAndUpdate({boardTypeID: boardTypeID}, {
            $set: updateData
        });

        return {message: 'Board type update successfully'};
    } catch (error) {
        throw new Error('Error');
    }
};

// Done
export const deleteBoardType = async (boardTypeID) => {
    try {
        await BoardType.findOneAndDelete({
            boardTypeID: boardTypeID
        });

        return {message: 'Board type delete successfully'};
    } catch (error) {
        throw new Error('Error');
    }
};