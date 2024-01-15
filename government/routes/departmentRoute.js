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
router.get("/locations", (req,res) => {
  controllerAPI.locationController.findAllDistricts(req,res);
});
router.post("/locations", (req,res) => {
  controllerAPI.locationController.addDistrict(req,res);
});
router.delete("/locations/:districtID", (req,res) => {
  controllerAPI.locationController.deleteDistrict(req,res);
});
router.patch("/locations/:districtID", (req,res) => {
  controllerAPI.locationController.updateDistrict(req,res);
});
// phuong ben trong quan
router.get("/locations-detail", (req,res) => {
  controllerAPI.locationController.locationsDetails(req,res);
});
router.post("/locations-detail", (req,res) => {
  controllerAPI.locationController.addWard(req,res);
});
router.delete("/locations-detail/:wardID", (req,res) => {
  controllerAPI.locationController.deleteWard(req,res);
});
router.patch("/locations-detail/:wardID", (req,res) => {
  controllerAPI.locationController.updateWard(req,res);
});

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
