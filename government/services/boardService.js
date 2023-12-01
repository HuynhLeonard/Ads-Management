import Board from '../models/boardSchema.js';

// check loi vi tri diem dat
export const createNewBoard = async (req,res,next) => {
    try {
        const newBoard = new Board(req.body);
        const saveData = await newBoard.save();
        res.status(200).json({
            saveData
        })
    } catch (error) {
        throw new Error(`Error creating board: ${error.message}`);
    }
};

export const getSingleBoard = async (req,res,next) => {
    try {
        const board = await Board.find({boardID: req.params.id});
        res.status(200).json({
            board
        });
    } catch (error) {
        throw new Error(`Error getting board by ID: ${error.message}`);
    }
};

export const getAllBoards = async (req,res,next) => {
    try {
        const boards = await Board.find();
        res.status(200).json({
            boards
        });
    } catch (error) {
        throw new Error(`Error getting all boards: ${error.message}`);
    }
};

export const getAllBoardsOfSpot = async (req,res,next) => {
    try {
        const boards = await Board.find();
        res.status(200).json({
            boards
        })
    } catch (error) {
        throw new Error(`Error getting all boards: ${error.message}`);
    }
};

export const updateBoard = async (req,res,next) => {
    try {
        const updatedBoard = await Board.findOneAndUpdate(
            { boardID: req.params.id },
            { $set: req.body },
        );
        res.status(200).json({
            updatedBoard
        })
    } catch (error) {
        throw new Error(`Error updating board by ID: ${error.message}`);
    }
};

export const deleteBoardByID = async (req,res,next) => {
    try {
        await Board.findOneAndDelete({ boardID: req.params.id });
        res.status(200).json({
            message: 'Board Deleted successfully'
        });
    } catch (error) {
        throw new Error(`Error deleting board by ID: ${error.message}`);
    }
};

export const countAll = async () => {
    try {
        const docs = Board.countDocuments();
        res.status(200).json({
            docs
        })
    } catch (error) {
        throw new Error(`Error couting boards of spot: ${error.message}`);
    }
};

export const countDistrict = async (districtID) => {
    try {
        const docs = Board.countDocuments({districtID: districtID});
        res.status(200).json({
            docs
        })
    } catch (error) {
        throw new Error(`Error get wards of count documents: ${error.message}`)
    }
};