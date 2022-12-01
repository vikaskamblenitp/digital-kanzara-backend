const mongoose = require("mongoose");
const Notice = require("../models/notice");
const User = require("../models/user");

const getAllNotices = async (req, res) => {
	try {
		const {page} = req.query
		console.log(parseInt(page))
		const pageSize = 4
		const notices = await Notice.find({}).sort({_id: -1}).limit(pageSize).skip(pageSize*parseInt(page));
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
const getUserNotices = async (req, res) => {
	try{
	const {userID} = req.query
	const notices = await Notice.find({publisher: userID})
	res.status(200).json(notices)
	} catch(error) {
		res.status(500).json({message: error.message})
	}
}
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
		console.log("==", req.file)
		const user = await User.findOne({username: username});
		const filename = req.file ? req.file.filename : null
		const data = {
			...req.body,
			imageFilename: filename,
			publisher: user._id,
			postedOn: new Date().toString().split('.')[0],
		};
		const notice = await Notice.create(data);
		console.log("notice", notice)
		res.status(201).json({ notice });
	} catch (error) {
		console.log(`ERROR: ${error}`);
		res.status(500).json({msg: "some error", err: error})
	}
};

const editNotice = async (req, res) => {
	try {
		console.log(req.params)
		const { id : noticeID }= req.params;
		// const noticeID = mongoose.Types.ObjectId(id);
		console.log("id:",noticeID)
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
// Add logic for deleting the notice image stored in static files folder
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
	getUserNotices,
	getNotice,
	addNotice,
	editNotice,
	deleteNotice,
};
