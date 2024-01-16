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
import departmentRoute from './government/routes/departmentRoute.js';
import * as api from "./government/controllers/MainAPI/main.js";
import {checkAuth} from './government/middleware/authMiddleware.js';
// import testController from "./government/controllers/testController.js";
import flash from 'express-flash';
import session from 'express-session';
import passportConfig from './government/config/passport.js';
import passport from 'passport';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import imgurController from './government/controllers/imgurController.js';


const governmentApp = express();
governmentApp.use(express.json());
governmentApp.use(express.urlencoded({ extended: false }));
governmentApp.use(flash());
governmentApp.use(cors());

governmentApp.set('views', path.join(__dirname, 'government','views'));

governmentApp.locals.generateDetailLink = ({id, linkDetails}) => {
    const { basePath, category } = linkDetails
    if (category) {
        return `${basePath}/${id}?category=${category}`
    }
    return `${basePath}/${id}`
}

governmentApp.set('view engine', 'ejs');
console.log(`${governmentApp.get('views')}`);

const publicDirectory = path.join(__dirname, '/government/public');
console.log(publicDirectory)
governmentApp.use(express.static(publicDirectory));
governmentApp.use(cookieParser('leonardHuynh'));

passportConfig(passport)
governmentApp.use(
    session({
        secret: 'hihihi', // secret key
        resave: false,
        saveUninitialized: true
         // use local session, session store will be cleared when the server restarts
    })
);
governmentApp.use(passport.initialize())
governmentApp.use(passport.session())

governmentApp.use((req, res, next) => {
    res.locals.url = req.originalUrl
    res.locals.host = req.get('host')
    res.locals.protocol = req.protocol
    res.locals.message = req.flash()
    res.locals.username = req.signedCookies.username || ''
    res.locals.password = req.signedCookies.password || ''
    next();
})

// mongodb+srv://thienhuuhuynhdev:thienhuu2003@server.1iqibpx.mongodb.net/Advertisment?retryWrites=true&w=majority


governmentApp.get("/", (req,res) => {
    res.render('index', {
        title: 'Sở Văn Hóa',
        username: "",
        password: "",
    });
});

import {loginController} from "./government/controllers/authController.js";
governmentApp.post('/', loginController);
// governmentApp.post('/', (req,res) => {
//     res.redirect('/department')
// });

governmentApp.use('/department',departmentRoute);
governmentApp.use('/add', (req,res) => {
    res.render('add')
})

governmentApp.get('/show', (req,res) => {
    res.send(req.user);
})

import apiRoute from "./government/routes/apiRoutes.js";
import districtRoute from './government/routes/districtRoute.js';
import { setHeaders } from './government/routes/apiRoutes.js';
governmentApp.use('/api',setHeaders ,apiRoute);
governmentApp.use('/department', departmentRoute);
governmentApp.use('/district', checkAuth, districtRoute);
// governmentApp.get('/api/location/', (req,res) => {
//     api
//         .getAllLocations(req.query.districtID, req.query.wardID)
//         .then((location) => res.status(200).json(location));
// });
governmentApp.get('/imgur', imgurController.getAccessToken);
import userController from './government/controllers/userController.js'
governmentApp.post('/test', userController.createUser);

// ==============================================================================
// test area
import uploadingRoute from './government/routes/uploading.js';
governmentApp.use('/pic', uploadingRoute);

governmentApp.use(morgan('dev'))
mongoose.connect('mongodb+srv://thienhuuhuynhdev:thienhuu2003@server.1iqibpx.mongodb.net/Advertisment?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connect to Database');
    })

const governmentServer = http.createServer(governmentApp);
governmentServer.listen(process.env.GOVERNMENT_PORT, () => {
    console.log(
        `Government App is running on http://localhost:${process.env.GOVERNMENT_PORT}`
    );
});
