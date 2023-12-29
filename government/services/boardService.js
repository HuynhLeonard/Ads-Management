import boardSchema from '../models/boardSchema.js';
import Board from '../models/boardSchema.js';

// check loi vi tri diem dat
// Done
export const createNewBoard = async (boardData) => {
    try {
        const newBoard = new Board(boardData);
        const saveData = await newBoard.save();
        return saveData;
    } catch (error) {
        throw new Error(`Error creating board: ${error.message}`);
    }
};

// Done
export const getSingleBoard = async (boardID) => {
    try {
        const board = await Board.find({boardID: boardID});
        return board;
    } catch (error) {
        throw new Error(`Error getting board by ID: ${error.message}`);
    }
};

// Done
export const getAllBoards = async () => {
    try {
        const boards = await Board.find();
        
        return boards
    } catch (error) {
        throw new Error(`Error getting all boards: ${error.message}`);
    }
};

// done
export const getAllBoardsOfSpot = async (spotID) => {
    try {
        const boards = await Board.find({spotID: spotID});
        return boards;
    } catch (error) {
        throw new Error(`Error getting all boards: ${error.message}`);
    }
};

// done
export const updateBoard = async (boardID, updatedData) => {
    try {
        const updatedBoard = await Board.findOneAndUpdate(
            { boardID: boardID },
            { $set: updatedData },
        );
        
        return {message: 'Board upated successfully'}
    } catch (error) {
        throw new Error(`Error updating board by ID: ${error.message}`);
    }
};

// done
export const deleteBoardByID = async (boardID) => {
    try {
        await Board.findOneAndDelete({ boardID: boardID });
        return {message: 'Board deleted successfully.'}
    } catch (error) {
        throw new Error(`Error deleting board by ID: ${error.message}`);
    }
};

// count function

export const countAll = async () => {
    try {
        const docs = Board.countDocuments();
        return docs
    } catch (error) {
        throw new Error(`Error couting boards of spot: ${error.message}`);
    }
};

export const countDistrict = async (districtID) => {
    try {
        const docs = Board.countDocuments({districtID: districtID});
        
        return docs
    } catch (error) {
        throw new Error(`Error get wards of count documents: ${error.message}`)
    }
};

export const countByLocation = async (locationID) => {
    try {
        return Board.countDocuments({locationID: locationID});
    } catch (error) {
        throw new Error("Error getting information!");
    }
};

export const countByWard = async (wardID) => {
    try {
        return Board.countDocuments({wardID: wardID});
    } catch (error) {
        throw new Error('Error happen when getting information.');
    }
}