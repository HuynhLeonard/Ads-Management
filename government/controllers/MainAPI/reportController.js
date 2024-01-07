import * as apiService from "../../services/apiService.js";
import * as boardService from "../../services/boardService.js";

export const getBoard = async (boardID) => {
    try {
        return await boardService.getSingleBoard(boardID);
    } catch (error) {
        throw new Error('Error getting boards');
    }
}