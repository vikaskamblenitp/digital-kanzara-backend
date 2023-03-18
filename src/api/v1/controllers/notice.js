const Notice = require("../models/notice");
const User = require("../models/user");
const { cloudinary } = require("@configs/cloudinary.js");
const count = require("./Counter");
const { _getProfileURL } = require("./user/user");
const { sendPushNotificationAsync } = require("../../../helpers/notification");

/**
 * GET ALL POSTS
 */
const getAllNotices = async (req, res) => {
	try {
		await count("getAllNotices"); // To store count of this api call

		const { page, lastReadTime, endReadTime, sector, username } = req.query;
		let allVisitedFlag, deletePastFlag;
		const PAGE_SIZE = 15;

		const query = Notice.find();
		if(username) {
			query.where("username").equals(username);
    }
		if(sector) {
			query.where("sector").equals(sector);
		}
		if(lastReadTime) {
			query.where("postedOn").gt(lastReadTime);
		}
		if(endReadTime) {
			query.where("postedOn").lt(endReadTime);
		}

		const notices = await query.limit(PAGE_SIZE).sort("-_id");
		if(endReadTime) allVisitedFlag = notices.length < PAGE_SIZE ? true : false;
		if(lastReadTime) deletePastFlag = notices.length < PAGE_SIZE ? false : true;
		for(const notice of notices) {
			const {profileImage}= await _getProfileURL(notice.username);
			notice.profileImage = profileImage
		}
		
		res.status(200).json({notices, allVisitedFlag, deletePastFlag});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getCountOfPosts = async (req, res) => {
	try {
		const {currentTime, lastReadTime} = req.query;
		const notices = await Notice.find({ 'postedOn' : {$gt : lastReadTime, $lte: currentTime}}).count();
		res.status(200).json({notices})
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
const getUserNotices = async (req, res) => {
	try {
		await count("getUserNotices");
		const { username } = req.query;
		const notices = await Notice.find({ username }).sort({ _id: -1 });
		res.status(200).json(notices);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const getNotice = async (req, res) => {
	try {
		await count("getNotice");
		const { id: noticeID } = req.params;
		const notice = await Notice.findOne({ _id: noticeID });
		res.status(200).json({ notice });
	} catch (error) {
		console.log(error);
	}
};
const addNotice = async (req, res) => {
	try {
		await count("addNotice");
		if(req.file && req.file.size > 10000000) {
			return res.status(500).json({ message: "File size should be less than 10MB" });
		}
		const { username, role } = req.data;
		if(role == "USER"){
			return res.status(401).json({ message: "PLEASE SUBSCRIBE FOR ADDING YOUR POSTS" });
		}
		const {postLimit, profileImage, notifications} = await User.findOne({ username }, {postLimit:1, profileImage:1, _id:0});
		if (postLimit > 0) {
			let fileURL;
			if (req.file) {
				const imageData = await cloudinary.uploader.upload(req.file.path, {
					folder: "DigitalKanzara/files/"
				});
				fileURL = imageData.url;
			} else {
				fileURL = null;
			}
			const data = {
				...req.body,
				imageFilename: fileURL,
				username: username,
				profileImage: profileImage,
				postedOn: Date.now(),
			};
			await Notice.create(data);
			await User.updateOne({ username }, { $inc: { postLimit: -1 } });
			if(notifications) {
				await sendPushNotificationAsync({ title: req.body.title, username, description: req.body.description });
			}
			res.status(201).json({ message: "Post Added Successfully" });
		} else {
			res.status(500).json({message: "Your posting limit is exhausted"})
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const editNotice = async (req, res) => {
	try {
		await count("editNotice");
		const { id: noticeID } = req.params;
		const notice = await Notice.findOneAndUpdate({ _id: noticeID }, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(204).json({ notice });
	} catch (error) {
		res.status(505).json({ message: error.message });
	}
};
// Add logic for deleting the notice image stored in static files folder
const deleteNotice = async (req, res) => {
	try {
		await count("deleteNotice");
		const { id: noticeID } = req.params;
		const notice = await Notice.deleteOne({ _id: noticeID });
		res.status(200).json({ notice });
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	getAllNotices,
	getCountOfPosts,
	getUserNotices,
	getNotice,
	addNotice,
	editNotice,
	deleteNotice,
};
