import * as districtService from '../../services/districtService.js';
import * as wardService from "../../services/wardService.js";
import * as locationService from "../../services/locationService.js";
import * as locationDetailService from "../../services/location-detailService.js";
import * as boardService from "../../services/boardService.js";

const controller = {};

controller.findAllDistricts = async (req,res) => {
    const districts = await locationDetailService.getAll();
    const tableData = districts.map((district) => {
        return {
            districtID: district.districtID,
            districtName: `${district.districtName}`,
            cntWard: district.wardsCount,
            cntSpot: district.locationsCount,
            cntBoard: district.boardsCount
        }
    });

    const totalWard = await wardService.countAll();
    const totalSpot = await locationService.countAll();
    const totalBoard = await boardService.countAll();

    // console.log(tableData);
    // console.log(totalWard);
    // console.log(totalSpot);
    // console.log(totalBoard)

    return res.render('Department/locations', {
        tableData, totalBoard, totalSpot, totalWard,
        title: 'Sở VH-TT - Quản lý danh sách Quận'
    })
};

// ?district=id
controller.locationsDetails = async (req,res) => {
    let districtID = req.query.quan;
    console.log(districtID);
    let districtDetail = await locationDetailService.getDistrictDetail(districtID);
    console.log(districtDetail);
    districtDetail = districtDetail[0];
    const wards = await locationDetailService.getDetails(districtID);
    // console.log(wards);
    const districts = await districtService.getAllDistricts();
    // console.log(districts);
    
    // quan ly phuong
    res.render('Department/location-detail', {
        districtID,
        districtDetail: districtDetail,
        wards,
        districts,
        title: 'Sở - Quản lý Phường',
      });
};

controller.addDistrict = async (req,res) => {
    const data = {
        districtID: req.body.districtID,
        districtName: req.body.districtName
    };
    console.log(data);
    try {
        const message = await districtService.createNewDistrict(data);
        console.log(message);
        req.flash('success', message);
        res.redirect('/department/locations');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/department/locations');
    }
};

// ?districtID=
controller.deleteDistrict = async (req,res) => {
    const districtID = req.params.districtID;

    try {
        if(districtID != null) {
            const message = await districtService.deleteDistrict(districtID);
            res.redirect('/so/locations');
        }
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/departments/locations');
    }
};

controller.updateDistrict = async (req, res) => {
    const districtID = req.params.districtID;

    const data = req.body;

    try {
        const message = await districtService.updateDistrict(districtID, data);
        console.log(message);
        res.redirect('/so/locations');
    } catch (error) {
        console.log(error.message);
        req.flash('error', error.message);
        res.redirect('/so/locations');
    }
};

controller.addWard = async (req, res) => {
    const curDistrict = req.query.quan;
    const data = {
        wardID: req.body.wardID,
        wardName: req.body.wardName,
        districtID: curDistrict,
    };
    console.log(data);

    try {
        const message = await wardService.createNewWard(data);
        console.log(message);
        req.flash('success', message);
        res.redirect(`/department/locations-detail?quan=${curDistrict}`);
    } catch (error) {
        console.log(error.message);
        req.flash('error', error.message);
        res.redirect(`/department/locations-detail?quan=${curDistrict}`);
    }
};

controller.deleteWard = async (req, res) => {
    const curDistrict = req.query.quan;
    const wardID = req.params.wardID;
    // console.log(districtID);
    try {
        if (wardID != null) {
            const message = await wardService.deleteWard(wardID);
            console.log(message);
        res.redirect(`/department/locations-detail?quan=${curDistrict}`);
        }
    } catch (error) {
            console.log(error.message);
            req.flash('error', error.message);
    res.redirect(`/department/locations-detail?quan=${curDistrict}`);
    }
};

controller.updateWard = async (req, res) => {
    const curDistrict = req.query.quan;
    const wardID = req.params.wardID;
    const data = req.body;

    // console.log(districtID);
    // console.log(data);

    try {
        const message = await wardService.updateWardByID(wardID, data);
        console.log(message);
        res.redirect(`/so/locations-detail?quan=${curDistrict}`);
    } catch (error) {
        console.log(error.message);
        req.flash('error', error.message);
        res.redirect(`/so/locations-detail?quan=${curDistrict}`);
    }
}

export default controller;
