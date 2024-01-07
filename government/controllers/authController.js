import passport from 'passport';
import * as officerService from "../services/userService.js";

import {comparePassword, hashPassword} from '../services/passwordService.js';

const redirectUrl = (officer, res) => {
    const redirectMap = {
        admin: '/department',
        1: '/district',
        2: '/ward'
    }

    const positionKey = User.username === 'admin' ? 'admin' : officer.position;
    return res.redirect(redirectMap[positionKey] || '/');
}