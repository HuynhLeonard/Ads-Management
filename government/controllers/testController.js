import * as districtService from "../services/districtService.js";
import express from "express";
const router = express.Router();

router.post("/create", async (req,res,next) => {
    const boardType = await districtService.createNewDistrict(req.body);
    res.status(200).json({
        boardType
    })
});

router.get("/", async (req,res) => {
    const data = await districtService.getAllDistricts();
    res.status(200).json({
        data
    })
});

router.get("/:id", async (req,res) => {
    const data = await districtService.getDistrictByID(req.params.id);
    res.status(200).json({
        data
    })
});

router.put("/:id", async (req,res) => {
    const data = await districtService.updateDistrict(req.params.id, req.body);
    res.status(200).json({
        data
    })
});

router.delete("/:id", async (req,res) => {
    const data = await districtService.deleteDistrict(req.params.id);
    res.status(200).json({
        data
    })
})

export default router;