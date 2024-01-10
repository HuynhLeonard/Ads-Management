import bcrypt from 'bcryptjs';
import User from '../models/user.js';

export const hashPassword = async (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash_password = bcrypt.hashSync(password, salt);
    return hash_password;
};

export const comparePassword = async (username,enteredPassword) => {
    const user = await User.findOne({username: username}).select('+password');
    console.log('In password Service: ');
    console.log(user);
    console.log(enteredPassword);
    console.log(user.password);
    return bcrypt.compareSync(enteredPassword,user.password);
};
