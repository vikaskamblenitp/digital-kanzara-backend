const mongoose = require("mongoose");
const Notice = require("../models/notice");
const User = require("../models/user");

const getAllNotices = async (req, res) => {
	try {
		const notices = await Notice.find({});
		const noticeArray = [];
		for (var notice of notices) {
			const userId = mongoose.Types.ObjectId(notice.publisher);
			const user = await User.findOne({ _id: userId });
			const username = user.username;
			const profileImage = user.profileImage ? user.profileImage : null;
			noticeArray.push({
				...notice._doc,
				username: username,
				profileImage: profileImage,
			});
		}
		res.status(200).json({ notices: noticeArray });
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
		const { username } = req.user;
		const user = await User.findOne({username: username});
		const filename = req.file.filename ? req.file.filename : null;
		const data = {
			...req.body,
			imageFilename: filename,
			publisher: user._id,
			postedOn: new Date(),
		};
		const notice = await Notice.create(data);
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
			runValidators: true,
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
