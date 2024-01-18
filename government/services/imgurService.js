import dotenv from 'dotenv';
import request from 'request';
dotenv.config();
const callbackURL = process.env.IMGUR_CALLBACK_URL;
const authURL = process.env.IMGUR_AUTH_URL
const tokenURL = process.env.IMGUR_TOKEN_URL;
const clientID = process.env.IMGUR_CLIENT_ID;
const clientSecret = process.env.IMGUR_CLIENT_SECRET;
const refreshToken = process.env.IMGUR_REFRESH_TOKEN;
const accessToken = process.env.IMGUR_ACCESS_TOKEN;

export const getAccessToken = async () => {
  // if accessToken is not expired, return it
  if (accessToken) {
    return {message: 'Access token is not expired.', accessToken};
  }
  else return {message: 'Access token is expired.', accessToken: null};
}