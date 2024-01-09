import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { getSingleUser, getUserUsingGoogleID} from '../services/userService.js'
import { comparePassword } from '../services/passwordService.js';

const passportConfig = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async (username, password, done) => {
            try {
                const officer = await getSingleUser(username);
                // if (!officer || !await comparePassword(password, officer.password)) {
                // return done(null, false, { message: 'Tên đăng nhập hoặc mật khẩu không đúng' })
                // }
                return done(null, officer)
            } catch (error) {
                return done(error)
            }
            })
    )
    
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLECLIENTID,
            clientSecret: process.env.GOOGLECLIENTSECRET,
            callbackURL: '/oauth/redirect/google'
        },
        async (accessToken, refreshToken,profile,done) => {
            try {
                const officer = await getUserUsingGoogleID(profile.id);
                if(!officer) {
                    return done(null, false, {message: 'Invalid account'});
                }
                return done(null, officer);
            } catch (error) {
                return done(error);
            }
        }
    ))

    passport.serializeUser((officer, done) => {
        done(null, officer.username);
    });

    passport.deserializeUser(async (username, done) => {
        try {
            const user = await getSingleUser(username);
        } catch (error) {
            done(error);
        }
    });
};

export default passportConfig;