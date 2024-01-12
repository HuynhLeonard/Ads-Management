import express from "express";
import controller from "../controllers/WardDistrict/main.js";

const router = express.Router();

router.get("*", (req, res, next) => {
    res.locals.user = req.user;
    next();
});

// trang chu
router.get("/", (req, res) => {
    res.render("Department/index");
});

// // nhom location (quan)
// router.get("/locations");
// router.post("/locations");
// router.delete("/locations/:districtID");
// router.patch("/locations/:districtID");
// // phuong ben trong quan
// router.get("/location-detail");
// router.post("/location-detail");
// router.delete("/location-detail/:wardID");
// router.patch("/location-detail/:wardID");

// nhom quang cao (diem dat)
router.get("/advertisements");
router.get("/advertisements/new", (req, res) => {
    controller.adsController.showAdd(req,res);
});
// query: category, lng, lat
router.post("/advertisements/new");
router.get("/advertisements/:id");
router.get("/advertisements/edit/:id");
router.post("/advertisements");

export default router;
