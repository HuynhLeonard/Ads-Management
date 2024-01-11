import * as locationService from "../../services/locationService.js";
import * as boardService from "../../services/boardService.js";
import * as wardService from "../../services/wardService.js";
import * as districtService from "../../services/districtService.js";
import * as locationTypeService from "../../services/locationTypeService.js";
import * as adsCategoryService from "../../services/adsCategoriesService.js";
import * as boardTypeService from "../../services/boardTypeService.js";

// 2 type including spot and board
// show all district in table and choose
export const show = async (req, res) => {
    const category = req.query.category || "";
    // add table
    let checkboxData = await districtService.getAllDistricts();
    checkboxData = checkboxData.map((district) => `Quận ${district.districtName}`);
    let current = 0;
    try {
        switch (category) {
            // them diem dat
            case "spot":
                title = "";
                tableHeads = [];
                tableData = await locationService.getAllLocation();
                tableData = tableData.map((location) => {
                    // data for each location
                });
                break;
            case "board":
                title = "";
                tableHeads = [];
                tableData = await boardService.getAllBoards();
                tableData = tableData.map((board) => {
                    // data for each board
                });
                break;
            default:
                res.status(404).render();
        }

        // show thong ke
        res.render();
    } catch (error) {
        res.status(500).render();
    }
};

export const showDetail = async (req, res) => {};

export const showAddForm = async (req, res) => {};

export const showModifyForm = (req, res) => {};

export const addNewSpot = async (req, res) => {};

export const addNewBoard = async (req, res) => {};

export const performAdd = async (req, res) => {};
