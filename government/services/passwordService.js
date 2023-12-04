import bcrypt from 'bcrypt';
import User from '../models/user.js';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (username,enteredPassword) => {
    const user = await User.find({username: username});

    return await bcrypt.compare(enteredPassword,user.password);
};
