const { default: mongoose } = require("mongoose")

const counterSchema = new mongoose.Schema({
    getAllNotices: { type: Number},
	getUserNotices: { type: Number},
	getNotice: { type: Number},
	addNotice: { type: Number},
	editNotice: { type: Number},
	deleteNotice: { type: Number},
    login: { type: Number},
	signup: { type: Number},
	tokenValidity: { type: Number},
	updateProfile: { type: Number},
})

module.exports = mongoose.model('Counter',counterSchema);