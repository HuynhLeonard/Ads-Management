import passport from 'passport';
import * as officerService from "../services/userService.js";
import {comparePassword, hashPassword} from '../services/passwordService.js';

const redirectUrl = (officer, res) => {
    const redirectMap = {
        admin: '/department',
        1: '/district',
        2: '/ward'
    }
    const positionKey = officer.username === 'admin' ? 'admin' : officer.position;
    console.log(redirectMap[positionKey])
    return res.redirect(redirectMap[positionKey] || '/');
};

const authController = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, { failureRedirect: '/' }, (err, officer, info) => {
        if (err) {
            return next(err);
        }

        if (!officer) {
            req.flash('error', info.message)
            return res.redirect('/');
        }

        if (officer.position === 0) {
            req.flash('error', 'Tài khoản của bạn chưa được cấp quyền');
            return res.redirect('/');
        }

        if (req.body.rememberPass) {
            res.cookie('username', req.body.username, {
                maxAge: 60 * 60 * 1000,
                httpOnly: false,
                signed: true,
            });
            res.cookie('password', req.body.password, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                signed: true,
            });
        }
        console.log(officer);
        req.login(officer, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            if (req.query.reqUrl) {
                return res.redirect(req.query.reqUrl);
            }
            return redirectUrl(officer, res);
            });
    })(req, res, next);
};

export const loginController = authController('local');