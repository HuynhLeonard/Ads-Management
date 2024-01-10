import express from "express";

const router = express.Router();

router.get("*", (req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.role = "district";
    next();
});

// route trang chu
router.get("/", (req, res) => {
    res.render("District/index");
});

// lay thong tin officer (:username)
router.get("/officer/:username");

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
router.get("/advertisements");
router.get("/advertisements/new", (req, res) => {
    res.render("add");
});
router.post("/advertisements/new");
router.get("/advertisements/:id");
router.get("/advertisements/edit/:id");
router.post("/advertisements");

// nhóm giấy phép (license)
router.get("/license");

export default router;
