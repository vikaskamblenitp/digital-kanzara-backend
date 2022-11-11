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
    owner: {
        type: String
    },
    publisher: {
        type: String
    },
    phone: {
        type: Number,
        max: [9999999999]
    },
    postedOn: {
        type: Date,
    }
})

module.exports = mongoose.model('Notice',noticeSchema);