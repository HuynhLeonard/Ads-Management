import express from "express";
import path from "path";
// create 2 servers
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
const __dirname = path.resolve();

dotenv.config(path.join(__dirname, ".env"));

const citizenApp = express();

citizenApp.use(express.static(path.join(__dirname, "citizen/public")));
citizenApp.use(express.json());
citizenApp.get("/");

const citizenServer = http.createServer(citizenApp);
citizenServer.listen(process.env.CITIZENPORT, () => {
  // console.log(`Citizen App is running on http://localhost:${process.env.CITIZENPORT}`);
});

// ======================================================================================

// setup for governmentApp
// import { createCategories, deleteCategorires, getAllCategories, getSingleCategories, modifyCategories } from './government/services/adsCategoriesService.js';
// import { createNewDistrict, deleteDistrict, getAllDistricts, getDistrictByID, updateDistrict } from './government/services/districtService.js';
// import { createNewLocation, getAllLocation } from './government/services/locationService.js';
// import { createNewLocationType, deleteLocationType, getAllLocationType, getLocationType, updateLocationType } from './government/services/locationTypeService.js';
// import { createNewWard, getAllWard, getWard, getWardOfDistrict, updateWard } from './government/services/wardService.js';
// import * as boardTypeService from './government/services/boardTypeService.js';
// import * as boardService from './government/services/boardService.js';
import departmentRoute from "./government/routes/departmentRoute.js";
import locationController from "./government/controllers/locationsController.js";

const governmentApp = express();
governmentApp.use(express.json());
governmentApp.use(express.urlencoded({ extended: false }));
governmentApp.use(cors());
governmentApp.set("views", path.join(__dirname, "government", "views"));
governmentApp.set("view engine", "ejs");
console.log(`${governmentApp.get("views")}`);

const publicDirectory = path.join(__dirname, "/government/public");
console.log(publicDirectory);
governmentApp.use(express.static(publicDirectory));

mongoose
  .connect(
    "mongodb+srv://thienhuuhuynhdev:thienhuu2003@server.1iqibpx.mongodb.net/Advertisment?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connect to Database");
  });

governmentApp.get("/", (req, res) => {
  res.render("index");
});

governmentApp.use("/department", departmentRoute);

governmentApp.get("/api/location/", locationController.getAllLocation);

const governmentServer = http.createServer(governmentApp);
governmentServer.listen(process.env.GOVERNMENT_PORT, () => {
  console.log(
    `Government App is running on http://localhost:${process.env.GOVERNMENT_PORT}`
  );
});
