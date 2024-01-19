import express from "express";
import controller from "../controllers/WardDistrict/main.js";
const router = express.Router();

router.get("*", (req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.role = "ward";
    next();
});

// route trang chu
router.get("/", async (req, res) => {
    controller.indexController.show(req,res);
});

// lay thong tin officer (:username)
router.get("/officer/:username", async (req,res) => controller.infoController.getInfo(req,res));
router.get("/officer", (req,res) => {
    res.redirect(`officer/${req.user.username}`);
});
router.post('/officer/:username', async (req, res) => controller.infoController.updateInfo(req, res));
//nhóm report
router.get("/reports", async (req,res) => {
    controller.reportController.show(req,res);
});
router.get("/reports/:reportID", async (req,res) => {
    controller.reportController.showDetail(req,res);
});
router.post("/reports/:reportID", async (req,res) => {
    controller.reportController.updateReport(req,res);
});

//nhom them diem dat vao quan
router.get("/locations");
router.post("/locations");
router.delete("/locations/:districtID");
router.patch("/locations/:districtID");

// nhóm bảng quảng cáo
router.get("/advertisements", async (req,res) => controller.adsController.show(req,res));
// /advertisements/new?category=Location
router.get("/advertisements/new", async (req, res) => controller.adsController.showAdd(req,res));
router.post("/advertisements/new");
router.get("/advertisements/:id", async (req,res) => controller.adsController.showDetail(req,res,false));
router.get("/advertisements/:id/modify", async (req,res) => controller.adsController.showDetail(req,res,true));
router.post("/advertisements/:id", async (req,res) => controller.adsController.request(req,res));

// nhóm giấy phép (license)
router.get('/license', async (req, res) => controller.licenseController.show(req, res));
router.get('/license/create', async (req, res) => controller.licenseController.showCreate(req, res));
router.get('/license/:id', async (req, res) => controller.licenseController.showDetail(req, res, true))
router.delete('/license/:id', async (req, res) => controller.licenseController.deleteRequest(req, res));
router.post('/license', async (req, res) => controller.licenseController.add(req, res));
router.get('/license/extend/:id', async (req, res) => controller.licenseController.showExtend(req, res));
router.post('/license/extend/:id', async (req, res) => controller.licenseController.add(req, res));

export default router;
