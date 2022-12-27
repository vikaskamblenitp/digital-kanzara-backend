const Notice = require("../models/notice");
const User = require("../models/user");
const { cloudinary } = require("@configs/cloudinary.js");
const count = require("./Counter");
const getAllNotices = async (req, res) => {
	try {
		await count("getAllNotices");
		const { page } = req.query;
		console.log(parseInt(page));
		const pageSize = 10;
		const notices = await Notice.find({})
			.sort({ _id: -1 })
			.limit(pageSize)
			.skip(pageSize * parseInt(page));

		res.status(200).json({ notices });
	} catch (error) {
		console.log(error);
	}
};
const getUserNotices = async (req, res) => {
	try {
		await count("getUserNotices");
		const { userID } = req.query;
		const notices = await Notice.find({ publisher: userID }).sort({ _id: -1 });
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
		const { username } = req.user;
		console.log("==", req.file);
		const user = await User.findOne({ username: username });
		if (user.postLimit > 0) {
			let fileURL;
			if (req.file) {
				const imageData = await cloudinary.uploader.upload(req.file.path, {
					folder: "DigitalKanzara/files/",
					transformation: { width: 1080, height: 720, crop: "scale" },
				});
				fileURL = imageData.url;
				console.log("cloudinary_response:", imageData);
			} else {
				fileURL = null;
			}
			const data = {
				...req.body,
				imageFilename: fileURL,
				publisher: user._id,
				username: user.username,
				profileImage: user.profileImage,
				postedOn: Date.now(),
			};
			const notice = await Notice.create(data);
			res.status(201).json({ msg: "Post Added Successfully" });
		} else {
			res.status(500).json({message: "Your posting limit is exhausted"})
		}
	} catch (error) {
		console.log(`ERROR: ${error}`);
		res.status(500).json({ msg: "some error", err: error });
	}
};

const editNotice = async (req, res) => {
	try {
		await count("editNotice");
		console.log(req.params);
		const { id: noticeID } = req.params;
		// const noticeID = mongoose.Types.ObjectId(id);
		console.log("id:", noticeID);
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
	getUserNotices,
	getNotice,
	addNotice,
	editNotice,
	deleteNotice,
};
