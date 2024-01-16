import * as adsCategoryService from "../../services/adsCategoriesService.js";
import * as boardService from "../../services/boardService.js";
import * as boardTypeService from "../../services/boardTypeService.js";
import * as IDCreate from "../../services/createIDService.js";
import * as districtService from "../../services/districtService.js";
import * as locationService from "../../services/locationService.js";
import * as locationTypeService from "../../services/locationTypeService.js";
import * as wardService from "../../services/wardService.js";

// 2 type including spot and board
// show all district in table and choose
// category = Location || Board
export const show = async (req, res) => {
    const category = req.query.category || "";
    // add table
    let checkboxData = await districtService.getAllDistricts();
    checkboxData = checkboxData.map((district) => `Quận ${district.districtName}`);
    let current = 0;
    try {
        switch (category) {
            // them diem dat
            case "Location":
                title = "Sở - Điểm đặt";
                tableHeads = ['ID', 'Quận', 'Phường', 'Điểm đặt', 'Loại vị trí', 'Hình thức quảng cáo', 'Thông tin quy hoạch'];
                tableData = await locationService.getAllLocation();
                tableData = tableData.map((location) => ({
                    // data for each location
                    id: location.locationID,
                    district: location.districtName,
                    ward: location.wardName,
                    spot: location.locationName,
                    locationType: location.locationType,
                    type: location.adsForm,
                    plan: location.planned === 1 ? 'Đã quy hoạch' : 'Chưa quy hoạch',
                    actions: {
                        edit: false,
                        remove: true,
                        info: true
                    }
                }));
                current = 0;
                break;
            case "Board":
                title = "Sở - Bảng quảng cáo";
                tableHeads = ['ID', 'Quận', 'Phường', 'Điểm đặt', 'Loại bảng quảng cáo', 'Kích thước', 'Số lượng'];
                tableData = await boardService.getAllBoards();
                tableData = tableData.map((board) => ({
                    // data for each board
                    id: board.boardID,
                    district: board.districtName,
                    ward: board.wardName,
                    spot: board.locationName,
                    type: board.boardTypeName,
                    size: `${board.width}x${board.height}m`,
                    quantity: `${board.quantity} trụ / bảng`,
                    actions: {
                        edit: false,
                        remove: true,
                        info: true
                    }
                }));
                current = 1;
                break;
            default:
                res.status(404).render();
        }

        let checkboxData = await districtService.getAllDistricts()
        checkboxData = checkboxData.map((district) => {
            return {
                name: `Quận ${district.districtName}`,
                status: tableData.some(item => item.district === district.districtName)
            }
        });
        // show thong ke
        res.render('ads', {
            url: req.originalUrl,
            title,
            category,
            tableHeads,
            tableData,
            checkboxHeader: 'THÀNH PHỐ HỒ CHÍ MINH',
            checkboxData,
            current
        });
    } catch (error) {
        res.status(500).render('error', { error: { status: 500, message: 'Lỗi server' } });
    }
};

// category = Location || Board
export const showDetail = async (req, res, isEdit) => {
    const category = req.query.category || ''
    const title = 'Sở - Chi tiết ' + (category === 'Location' ? 'điểm đặt' : 'bảng quảng cáo')
    const role = String(req.originalUrl.split('/')[1])
    const ID = req.params.id || ''
    const isSpotCategory = category === 'Location' ? 1 : 0

    const getDataObject = category === 'Location' ? locationService.getSingleLocation : boardService.getSingleBoard
    const object = await getDataObject(ID)

    const commonData = {
        url: req.originalUrl,
        title,
        role: role
    }

    if (isSpotCategory) {
        const { spotName, address, wardName, districtName, locationTypeName, adsFormName, planned, spotImage } = object
        const data = {
            spotTitle: spotName,
            spotId: ID,
            spotAddress: address,
            wardName,
            districtName,
            locationTypeName,
            adsFormName,
            planned: planned === 1 ? 'Đã quy hoạch' : 'Chưa quy hoạch',
            imgUrls: spotImage
        }

        var boardsTableHeads = ['ID', 'Loại bảng quảng cáo', 'Kích thước', 'Số lượng']
        var boardsTableData = !isEdit ? await boardService.getAllBoardsOfSpot(ID) : []
        const transformedBoardsTableData = boardsTableData.map((board) => ({
            id: board.boardID,
            type: board.boardTypeName,
            size: `${board.height}x${board.width}m`,
            quantity: `${board.quantity} trụ/bảng`,
            actions: { edit: false, remove: false, info: true }
        }))

        if (isEdit) {
            let other = {}
            other.spottypes = (await locationTypeService.getAllLocationType()) || []
            other.adsforms = (await adsCategoryService.getAllCategories()) || []
            res.render('spot-modify', { ...commonData, ...data, other })
        } else {
            res.render('spot-detail', {
                ...commonData,
                ...data,
                boardsTableHeads,
                boardsTableData: transformedBoardsTableData
            })
        }
    } else {
        const data = {
            id: object.boardID,
            spotID: object.locationID,
            spotAddress: object.spotAddress,
            authCompany: object.authCompany,
            authCompanyAddress: object.authCompanyAddress,
            authCompanyPhone: object.authCompanyPhone,
            authCompanyEmail: object.authCompanyEmail,
            startDate: object.startDate.toLocaleDateString('vi-VN'),
            endDate: object.endDate.toLocaleDateString('vi-VN'),
            boardTypeName: object.boardTypeName,
            boardModelType: object.boardModelType,
            quantity: object.quantity,
            height: object.height,
            width: object.width,
            spotTypeName: object.spotTypeName,
            spotType: object.spotType,
            adsFormName: object.adsFormName,
            adsForm: object.adsForm,
            imgUrls: object.images,
            content: object.content,
            licenseNumber: object.licenseNumber,
        }

        if (isEdit) {
            let other = {};
            other.spots = (await locationService.getAllLocation()) || [];
            other.boardtypes = (await boardTypeService.getAllBoardType()) || [];
            res.render('board-modify', { ...commonData, ...data, other })
        } else {
            res.render('board-detail', { ...commonData, ...data })
        }
    }
};

// category = Location || Board
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
    switch (category) {
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

// category = Location || Board
export const showModifyForm = (req, res) => {
    const category = req.query.category || ''
    switch (category) {
        case 'Location':
            res.render('spot-modify', { url: req.originalUrl, title: 'Sở - Chỉnh sửa điểm đặt' })
            break
        case 'Board':
            res.render('board-modify', { url: req.originalUrl, title: 'Sở - Chỉnh sửa bảng quảng cáo' })
            break
        default:
            res.status(404)
            return res.render('error', { error: { status: 404, message: 'Không tìm thấy trang' } })
    }
};

// category = Location || Board
export const addNewSpot = async (req, res) => {
    const { locationName, longitude, latitude, address, wardID, districtID, locationType, adsForm, planned, images } = req.body;
    const locationID = await IDCreate.getNewID('Spot');
    const data = { locationID, locationName, longitude, latitude, address, wardID, districtID, locationType, adsForm, planned, images }
    try {
        await locationService.createNewLocation(data);
        res.status(200).json({ message: 'Điểm đặt mới đã được thêm thành công' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Lỗi server' })
    }
};

export const addNewBoard = async (req, res) => {
    const { boardType, quantity, height, width, spotImage } = req.body;
    const boardID = await IDCreate.getNewID('Board');
    const spotID = req.query.locationID;
    const data = {
        boardID: boardID,
        boardModelType: boardType,
        quantity: quantity,
        height: height,
        width: width,
        images: spotImage,
        locationID: spotID,
        licenseNumber: ''
    }

    // console.log(data);
    try {
        await boardService.createNewBoard(data)
        res.status(200).json({ message: 'Bảng quảng cáo đã được thêm thành công' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

// category = Location || Board
const addNew = async (req, res) => {
    const category = req.query.category || ''

    if (category == 'Location') {
        addNewSpot(req, res)
        return
    }

    addNewBoard(req, res)
    return
};

// category = Location || Board
export const performAdd = async (req, res) => {
    const category = req.query.category || ''
    const objectID = req.params.id || ''

    if (category == 'Location') {
        try {
            await locationService.deleteLocation(objectID)
            res.status(200).json({ message: 'Điểm đặt đã được xóa thành công' })
        } catch (error) {
            // console.error(error)
            res.status(500).json({ message: error.message })
        }
        return
    } else {
        try {
            await boardService.deleteBoardByID(objectID)
            res.status(200).json({ message: 'Bảng quảng cáo đã được xóa thành công' })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: error.message })
        }
        return
    }
};

export default {
    showAddForm,
    addNewBoard,
    addNewSpot,
    addNew
}
