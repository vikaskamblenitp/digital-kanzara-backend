const { default: mongoose } = require('mongoose')


const noticeSchema = new mongoose.Schema({
    sector: {
        type: String,
        required: true
    },
    title: {
        type: String,
        maxLength: [100, "Too Large Title"]
    },
    description: {
        type: String,
    },
    imageFilename: {
        type: String
    },
    username: {
        type: String
    },
    profileImage: {
        type: String
    },
    postedOn: {
        type: Number,
    }
})

module.exports = mongoose.model('Notice',noticeSchema);