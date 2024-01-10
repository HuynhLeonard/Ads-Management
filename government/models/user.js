import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // 3 roles: admin, department, district, ward
    position: {
        type: Number,
        required: true
    },
    districtID: {
        type: String,
        ref: 'Districts'
    },
    wardID: {
        type: String,
        ref: 'Wards'
    }
});

export default mongoose.model('Users', userSchema);