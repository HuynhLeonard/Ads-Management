import * as testService from "../services/userService.js";
import express from "express";
const router = express.Router();

router.post("/create", async (req,res,next) => {
    const user = await testService.createUser(req.body);
    res.status(200).json({
        user
    })
});

router.get("/", async (req,res) => {
    const data = await testService.getAllDistricts();
    res.status(200).json({
        data
    })
});

router.get("/:id", async (req,res) => {
    const data = await testService.getDistrictByID(req.params.id);
    res.status(200).json({
        data
    })
});

router.put("/:id", async (req,res) => {
    const data = await testService.updateDistrict(req.params.id, req.body);
    res.status(200).json({
        data
    })
});

router.delete("/:id", async (req,res) => {
    const data = await testService.deleteDistrict(req.params.id);
    res.status(200).json({
        data
    })
})

export default router;