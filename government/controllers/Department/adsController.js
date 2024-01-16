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

export const showAddForm = async (req, res) => {
    const category = req.query.category || '';
    let info = {};
    const [districts, wards, spotTypes, adsForms, boardTypes, spot] = await Promise.all([
        districtService.getAllDistricts(),
        wardService.getAllWard(),
        locationTypeService.getAllLocationType(),
        adsCategoryService.getAllCategories(),
        boardTypeService.getAllBoardType(),
        locationService.getSingleLocation(req.query.locationID || '')
    ])
    switch(category) {
        case 'Location':
            info.spottypes = spotTypes
            info.adsforms = adsForms
            info.districts = districts
            info.wards = wards
            res.render('addLocation', {
                url: req.originalUrl,
                title: 'So - Diem Dat',
                other: info
            })
            break
        case 'Board':
            info.locationID = spot.locationID
            info.locationAddress = spot.address
            info.locationDistrict = spot.districtName
            info.locationWard = spot.wardName
            info.boardtypes = boardTypes
            res.render('addBoard', {
                url: originalUrl,
                title: 'So - Bang Quang Cao',
                other: info
            })
            break
        default:
            res.status(404)
            return res.render('error', {
                title: '404',
                error: 'Không tìm thấy trang'
            })
    }
};

export const showModifyForm = (req, res) => {};

export const addNewSpot = async (req, res) => {
    const { locationName, longitude, latitude, address, wardID, districtID, locationType, adsForm,planned, images} = req.body;
    const locationID = 'LC103'
    const data = {locationID,locationName, longitude, latitude, address, wardID, districtID, locationType, adsForm,planned,images }
    try {
        await locationService.createNewLocation(data);
        res.status(200).json({ message: 'Điểm đặt mới đã được thêm thành công' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Lỗi server' })
    }
};

export const addNewBoard = async (req, res) => {};

export const performAdd = async (req, res) => {};

export default {
    showAddForm,
    addNewBoard,
    addNewSpot
}
