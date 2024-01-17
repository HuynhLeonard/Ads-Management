import express from "express";
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
router.get("/details", (req, res) => {
  res.render("Popup");
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
router.get("/advertisements", (req,res) => {
  controllerAPI.adsController.show(req,res);
});
router.get("/advertisements/new", (req, res) => {
    controllerAPI.adsController.showAddForm(req,res);
});
// query: category, lng, lat
router.post("/advertisements/new", (req,res) => {
    controllerAPI.adsController.addNewSpot(req,res);
});
router.get("/advertisements/:id", (req,res) => {
  console.log('come here');
  controllerAPI.adsController.showDetail(req,res,false);
});
router.get("/advertisements/:id/modify", (req,res) => {
  controllerAPI.adsController.showDetail(req,res,true);
});
router.post("/advertisements");

// nhom type
router.get('/types', async (req, res) => {
  await controllerAPI.typesController.show(req, res);
});
router.get('/types/:id', (req, res) => {
  controllerAPI.typesController.showDetail(req, res);
});

// add data
router.post('/types', async (req, res) => {
  await controllerAPI.typesController.add(req, res);
});

// updata data
router.post('/types/:id', async (req, res) => {
  await controllerAPI.typesController.modify(req, res);
});

router.delete('/types/:id', async (req, res) => {
  await controllerAPI.typesController.remove(req, res);
});

// nhom request
router.get('/requests', (req, res) => {
  controllerAPI.requestController.show(req, res);
});

router.get('/requests/:id', (req, res) => {
  controllerAPI.requestController.showDetail(req, res);
});

router.post('/requests/:id', (req, res) => {
  controllerAPI.requestController.requestProcessing(req, res);
})

router.post('/acceptlicense', (req, res) => controllerAPI.requestController.acceptLicense(req, res));
router.post('/rejectlicense/:id', (req, res) => controllerAPI.requestController.rejectLicense(req, res));

// nhom report
router.get('/reports', (req, res) => {
  controllerAPI.reportController.show(req, res);
})
router.get('/reports/:id', (req, res) => {
  controllerAPI.reportController.showDetail(req, res);
});
export default router;
