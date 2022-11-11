const Notice = require("../models/notice");

const getAllNotices = async (req, res) => {
	try {
		const notices = await Notice.find({});
		res.status(200).json({ notices });
	} catch (error) {
		console.log(error);
	}
};
const getNotice = async (req, res) => {
	try {
		const { id: noticeID } = req.params;
		const notice = await Notice.findOne({ _id: noticeID });
		res.status(200).json({ notice });
	} catch (error) {
		console.log(error);
	}
};
const addNotice = async (req, res) => {
	try {
		const {username} = req.user
		const notice = await Notice.create({...req.body, publisher: username, postedOn: new Date()});
		res.status(201).json({ notice });
	} catch (error) {
		console.log(`ERROR: ${error}`);
	}
};

const editNotice = async (req, res) => {
	try {
		const { id: noticeID } = req.params;
		const notice = await Notice.findOneAndUpdate({ _id: noticeID }, req.body, {
			new: true,
		});
		console.log(notice);
		res.status(204).json({ notice });
	} catch (error) {
		console.log(error);
	}
};

const deleteNotice = async (req, res) => {
	try {
		const { id: noticeID } = req.params;
		const notice = await Notice.deleteOne({ _id: noticeID });
		res.status(200).json({ notice });
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	getAllNotices,
	getNotice,
	addNotice,
	editNotice,
	deleteNotice,
};
