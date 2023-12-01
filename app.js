import express from 'express';
import path from 'path';
// create 2 servers
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
const __dirname = path.resolve();

dotenv.config(path.join(__dirname, '.env'));

const citizenApp = express();

citizenApp.use(express.static(path.join(__dirname, 'citizen/public')))
citizenApp.use(express.json());
citizenApp.get("/", )


const citizenServer = http.createServer(citizenApp);
citizenServer.listen(process.env.CITIZENPORT, () => {
    // console.log(`Citizen App is running on http://localhost:${process.env.CITIZENPORT}`);
});

// ======================================================================================

// setup for governmentApp
import {createNewDistrict,deleteDistrict,getAllDistricts,getDistrictByID,updateDistrict} from './government/services/districtService.js';
import {createNewWard,getAllWard,getWard,getWardOfDistrict,updateWard} from './government/services/wardService.js';
import {createNewLocationType,deleteLocationType,getAllLocationType,getLocationType,updateLocationType} from './government/services/locationTypeService.js';
import {createNewLocation, getAllLocation} from './government/services/locationService.js';
// import * as boardTypeService from './government/services/boardTypeService.js';
// import * as boardService from './government/services/boardService.js';

const governmentApp = express();
governmentApp.use(express.json());
governmentApp.use(express.urlencoded({ extended: false }));
governmentApp.use(cors());
governmentApp.set('views', path.join(__dirname, 'government','views'));
governmentApp.set('view engine', 'ejs');
console.log(`${governmentApp.get('views')}`);

const publicDirectory = path.join(__dirname, '/government/public');
console.log(publicDirectory)
governmentApp.use(express.static(publicDirectory))



mongoose.connect('mongodb+srv://thienhuuhuynhdev:thienhuu2003@server.1iqibpx.mongodb.net/Advertisment?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connect to Database')
    })


governmentApp.get("/", (req,res) => {
    res.render('index')
})

// for district service
governmentApp.post('/api/district/create-district', createNewDistrict);
governmentApp.get('/api/district', getAllDistricts);
governmentApp.get('/api/district/:id',getDistrictByID);
governmentApp.put('/api/district/:id', updateDistrict);
governmentApp.delete('/api/district/:id', deleteDistrict);

// for ward service
governmentApp.post('/api/ward/create-ward', createNewWard);
governmentApp.get('/api/ward', getAllWard);
governmentApp.get('/api/ward/single/:wardID', getWard);
governmentApp.get('/api/ward/:districtID', getWardOfDistrict);
governmentApp.put('/api/ward/:wardID', updateWard);

// for spot type service
governmentApp.post('/api/spot-type/create', createNewLocationType);
governmentApp.get('/api/spot-type', getAllLocationType);
governmentApp.get('/api/spot-type/:id', getLocationType);
governmentApp.put('/api/spot-type/:id', updateLocationType);
governmentApp.delete('/api/spot-type/:id', deleteLocationType);

// for locations
governmentApp.post('/api/location/create-location', createNewLocation);
governmentApp.get('/api/location/', getAllLocation);

const governmentServer = http.createServer(governmentApp);
governmentServer.listen(process.env.GOVERNMENT_PORT, () => {
    console.log(`Government App is running on http://localhost:${process.env.GOVERNMENT_PORT}`);
})