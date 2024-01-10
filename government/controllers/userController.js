import * as userService from '../services/userService.js';

const controller = {};

controller.createUser = async (req,res,next) => {
    const userData = req.body;

    const result = await userService.createUser(userData);

    res.status(200).json({
        result
    });
};

export default controller;