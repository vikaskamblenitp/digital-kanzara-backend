const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    phone: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: "consumer"
    },
    postLimit: {
        type: Number,
        default: 0
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
    }
})

module.exports = mongoose.model('User', userSchema);