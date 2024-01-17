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
router.get("/reports", (req,res) => {
    controller.reportController.show(req,res);
});
router.get("/reports/:reportID", (req,res) => {
    controller.reportController.showDetail(req,res);
});
router.post("/reports/:reportID", (req,res) => {
    controller.reportController.updateReport(req,res);
});

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
router.get("/advertisements/:id", (req,res) => controller.adsController.showDetail(req,res,false));
router.get("/advertisements/:id/modify", (req,res) => controller.adsController.showDetail(req,res,true));
router.post("/advertisements/:id", (req,res) => controller.adsController.request(req,res));

// nhóm giấy phép (license)
router.get('/license', (req, res) => controller.licenseController.show(req, res));
router.get('/license/create', (req, res) => controller.licenseController.showCreate(req, res));
router.get('/license/:id', (req, res) => controller.licenseController.showDetail(req, res, true))
router.delete('/license/:id', (req, res) => controller.licenseController.deleteRequest(req, res));
router.post('/license', (req, res) => controller.licenseController.add(req, res));
router.get('/license/extend/:id', (req, res) => controller.licenseController.showExtend(req, res));
router.post('/license/extend/:id', (req, res) => controller.licenseController.add(req, res));

export default router;
