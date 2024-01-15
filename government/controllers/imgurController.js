import * as imgurService from '../services/imgurService.js';

const getAccessToken = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    const { message, accessToken } = await imgurService.getAccessToken();
    res.status(200).json({ message, accessToken });
}

export default {
    getAccessToken
}