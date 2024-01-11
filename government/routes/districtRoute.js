import express from "express";
import controller from "../controllers/WardDistrict/main.js";
const router = express.Router();

router.get("*", (req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.role = "district";
    next();
});

// route trang chu
router.get("/", (req, res) => {
    controller.indexController.show(req,res);
});

// lay thong tin officer (:username)
router.get("/officer/:username", (req,res) => controller.infoController.getInfo(req,res));
router.post('/officer/:username', (req, res) => controller.infoController.updateInfo(req, res));
//nhóm report
router.get("/reports");
router.get("/reports/:reportID");
router.post("/reports/:reportID");

//nhom them diem dat vao quan
router.get("/locations");
router.post("/locations");
router.delete("/locations/:districtID");
router.patch("/locations/:districtID");

// nhóm bảng quảng cáo
router.get("/advertisements", (req,res) => controller.adsController.show(req,res));
// /advertisements/new?category=Location
router.get("/advertisements/new", (req, res) => controller.adsController.showAdd(req,res));
router.post("/advertisements/new");
router.get("/advertisements/:id");
router.get("/advertisements/edit/:id");
router.post("/advertisements");

// nhóm giấy phép (license)
router.get("/license");

export default router;
