import express from "express";
import controller from "../controllers/WardDistrict/main.js";
import controllerAPI from "../controllers/Department/main.js";

const router = express.Router();

router.get("*", (req, res, next) => {
    res.locals.user = req.user;
    next();
});

// trang chu
router.get("/", (req, res) => {
    res.render("Department/index");
});

// nhom location (quan)
router.get("/locations");
router.post("/locations");
router.delete("/locations/:districtID");
router.patch("/locations/:districtID");
// phuong ben trong quan
router.get("/location-detail");
router.post("/location-detail");
router.delete("/location-detail/:wardID");
router.patch("/location-detail/:wardID");

// nhom assign
router.get('/assign', (req, res) => {
    controllerAPI.assignController.show(req, res);
  });
  
  router.delete('/assign/:username', (req, res) => {
    controllerAPI.assignController.deleteAccount(req, res);
  })
  
  router.patch('/assign/:username', (req, res) => {
    controllerAPI.assignController.updateOfficer(req, res);
  })
  
  router.post('/assign', (req, res) => {
    controllerAPI.assignController.addOfficer(req, res);
  });

  router.get('/getWards/:id', async (req, res) => {
    await controllerAPI.assignController.getWards(req, res);
  })

// nhom quang cao (diem dat)
router.get("/advertisements");
router.get("/advertisements/new", (req, res) => {
    controllerAPI.adsController.showAddForm(req,res);
});
// query: category, lng, lat
router.post("/advertisements/new", (req,res) => {
    controllerAPI.adsController.addNewSpot(req,res);
});
router.get("/advertisements/:id");
router.get("/advertisements/edit/:id");
router.post("/advertisements");

export default router;
