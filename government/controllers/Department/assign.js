// assign là:
// 1. Tạo tài khoản cán bộ
// 2. Xem toàn bộ cán bộ 
// 3. Xóa 1 cán bộ
// 4. ......

import emailService from '../../services/emailService.js';
import * as userService from "../../services/userService.js";
import * as wardService from '../../services/wardService.js';
//import * as locationService from '../../services/districtService.js'
// hàm lấy tất cả phường của 1 quận
// :id
const getWards = async (req,res) => {
    const districtID = req.params.id;
    try {
        const district = await wardService.getWardOfDistrict(districtID);
        return res.status(200).json({
            district
        })
    } catch (error) {
        return res.status(500).json({ error: 'Error getting wards' });
    }

    // => json
}

// :username
const deleteAccount = async (req,res) => {
    const username = req.params.username;

    try {
        const result = await userService.deleteUserByUsername(username);
        return res.status(200).json({
            result
        })
    } catch (error) {
        return res.status(500).json({ error: 'Error update officer' });
    }
}

// :username
const updateOfficer = async (req,res) => {
    const username = req.params.username;
    const updateData = req.body;

    try {
        const updateUser = await userService.updateOfficer(username, updateData);

        if(!updateUser) {
            return res.status(404).json({error: 'Officer is existed'})
        }

        return res.status(200).json({
            updateUser
        })
    } catch (error) {
        return res.status(500).json({ error: 'Error update officer' });
    }

}

// username, email
const addOfficer = async (req,res) => {
    const data = req.body;
    const password = randomPassword();

    const newUser = {
        username: data.username,
        email: data.email,
        status: 0,
        password: password
    }
    try {
        const result = await userService.createUser(newUser);
        await emailService.sendNewPassword(data.email, password);
        return res.status(200).json({
            result
        });
    } catch (error) {
        return res.status(500).json({ error: 'Error add officer' });
    }
}

const randomPassword = () => {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let length = 8;
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        password += allowedChars.charAt(randomIndex);
    }
    return password;
}

export default {addOfficer, getWards, deleteAccount, randomPassword, updateOfficer};