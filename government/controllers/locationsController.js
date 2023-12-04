import * as LocationService from '../services/locationService.js';
import * as districtService from '../services/districtService.js';
import * as wardService from '../services/wardService.js';
import * as boardService from '../services/boardService.js';

const controller = {}

controller.getAllLocation = async (req,res,next) => {
    const locations = await LocationService.getAllLocation();
    // console.log(locations);
    res.status(200).json({
        locations
    })
};

// truyền lên thông báo khi tạo thành công
controller.createLocation = async (req,res,next) => {
    const newData = req.body;
    const result = await LocationService.createNewLocation(newData);
    res.status(200).json({
        result
    })
};

controller.updateLocation = async (req,res,next) => {
    const updatedData = req.body;
    const locationID = req.params.id;
    const result = await LocationService.updateLocation(locationID, updatedData);
    res.status(200).json({
        result
    });
};

controller.getLocation = async (req,res,next) => {
    const locationID = req.params.id;
    const result = await LocationService.getSingleLocation(locationID);
    res.status(200).json({
        result
    });
};

// get all location, boards
// check later
controller.findLocationsAllDistricts = async (req,res,next) => {
    const districts = await districtService.getAllDistricts();
    const countWards = await wardService.findAll();
    const countSpots = await LocationService.countAll();
    const countBoard = await boardService.countAll();

    const districtLocationDetail = {};
    
    await Promise.all(
        districts.map(async (district) => {
            const [countWards, countBoard, countSpots] = await Promise.all([
                wardService.countAllOfDistrict(district.districtID),
                boardService.countDistrict(district.districtID),
                LocationService.countByDistrict(district.districtID)
            ]);
            
            // create each object for districts
            districtLocationDetail[district.districtID] = {
                countWards,
                countBoard,
                countSpots
            }
        })
    );

    console.log(districtLocationDetail);
};

export default controller;