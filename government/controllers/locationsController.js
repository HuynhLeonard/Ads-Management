import * as LocationService from '../services/locationService.js';
import * as districtService from '../services/districtService.js';
import * as wardService from '../services/wardService.js';
import * as boardService from '../services/boardService.js';

const controller = {}

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
                boardService.countDistrict(district.district),
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