import * as districtService from '../../services/districtService.js';
import emailService from '../../services/emailService.js';
import * as userService from "../../services/userService.js";
import * as wardService from '../../services/wardService.js';
//import * as locationService from '../../services/districtService.js'
// hàm lấy tất cả phường của 1 quận
// :id
const show = async (req,res) => {
    const officers = await userService.getAllOfficer();
    // table
    const tableHeads = ['STT', 'Tên Đăng Nhập', 'Chức vụ', 'Quận', 'Phường'];
    // gọi hàm lấy table data 
    const tableData = officers.map((officer) => {
        return {
            username: officer.username,
            email: officer.email,
            district: officer.districtName || '',
            ward: officer.wardName || '',
            districtID: officer.districtID,
            wardID: officer.wardID,

            // các thông tin còn lại
            position: officer.position === 1 ? 'Cán bộ Quận' : officer.position === 2 ? 'Cán bộ Phường' : 'Chưa phân công',
            // isAssigned =>
            isAssigned: officer.position !== 0,
            actions: {
                edit: true,
                remove: true,
                info: true,
            }
            
        }
    });

    // lấy số lượng tất cả officer
    const totalOfficer = tableData.length;
    // Các officer đã được assigned
    const numberOfAssignedOfficers = tableData.filter((officer) => officer.isAssigned).length
    // lấy tất cả phường, quận
    const districts = await districtService.getAllDistricts();
    const wards = await wardService.getAllWard();
    res.render('/department/assign', {
        title: 'Sở - Phân công',
        tableHeads,
        tableData,
        totalOfficers,
        numberOfAssignedOfficers,
        districts,
        wards
    });
}

const getWards = async (req,res) => {
    const districtID = req.params.id;
    try {
        const wards = await wardService.getWardOfDistrict(districtID);
        return res.json(wards)
    } catch (error) {
        return res.status(500).json({ error: 'Error getting wards' });
    }
}

// :username
const deleteAccount = async (req,res) => {
    const username = req.params.username;

    try {
        const {message} = await userService.deleteUserByUsername(username);
        return res.status(200).json({
            message: message
        })
    } catch (error) {
        req.flash('error', error.message);
        return res.status(500).json({ message: error.message });
    }
}

// :username
const updateOfficer = async (req,res) => {
    const username = req.params.username;
    const updateData = req.body;

    try {
        const {message} = await userService.updateOfficer(username, updateData);
        return res.status(200).json({
            message: message
        })
    } catch (error) {
        req.flash('error', error.message);
        return res.status(500).json({ message: error.message });
    }

}

// username, email
const addOfficer = async (req,res) => {
    const data = req.body;
    let password = randomPassword();
    emailService.sendNewPassword(data.email, password);

    const newUser = {
        username: data.username,
        email: data.email,
        position: 0,
        password: password,
        districtID: '',
        wardID: ''
    }
    try {
        const message = await userService.createUser(newUser);
        
        req.flash('success', message);
        res.redirect('/department/assign');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/department/assign');
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