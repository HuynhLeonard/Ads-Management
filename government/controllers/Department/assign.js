// assign là:
// 1. Tạo tài khoản cán bộ
// 2. Xem toàn bộ cán bộ 
// 3. Xóa 1 cán bộ
// 4. ......
import * as userService from "../../services/userService.js";
import * as wardService from "../../services/wardService.js";
import * as locationService from "../../services/districtService.js";
import emailService from "../../services/emailService.js";
import {comparePassword,hashPassword} from "../../services/passwordService.js";

// hàm lấy tất cả phường của 1 quận
// :id
const getWards = async (req,res) => {
    const districtID = req.params.id;
    // => json
} 

// :username
const deleteAccount = async (req,res) => {

}

// :username
const updateOfficer = async (req,res) => {

}

// username, email
const addOfficer = async (req,res) => {
    
}

const randomPassword = () => {
    let length = 8;
    let password = '';
    // handle here
    return password;
}

export default {addOfficer, getWards, deleteAccount, randomPassword, updateOfficer};