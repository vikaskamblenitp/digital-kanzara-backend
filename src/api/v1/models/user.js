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
        default: "USER"
    },
    postLimit: {
        type: Number,
        default: 30
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
    },
    notifications: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    likes: [{postId: String, time: Number}],
    dislikes: [{postId: String, time: Number}]
})

module.exports = mongoose.model('User', userSchema);