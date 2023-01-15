const Notice = require("../models/notice");
const User = require("../models/user");
const { cloudinary } = require("@configs/cloudinary.js");
const count = require("./Counter");
const { _getProfileURL } = require("./user/user");
const getAllNotices = async (req, res) => {
	try {
		await count("getAllNotices");
		console.log("getAllNotices");

		const { page, lastReadTime, endReadTime, sector, username } = req.query;
		console.log({ lastReadTime, endReadTime, sector, username })
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
		if(lastReadTime) deletePastFlag = notices.length < 15 ? false : true;
		for(const notice of notices) {
			 const {profileImage}= await _getProfileURL(notice.username);
			 notice.profileImage = profileImage
		}
		console.log({ notices, allVisitedFlag, deletePastFlag });
		
		res.status(200).json({notices, allVisitedFlag, deletePastFlag});

		
		// if(sector) {
		// 	const notices = await Notice.find({ sector }).sort(-1);
		// 	// const allVisitedFlag = notices.length < pageSize ? true : false;
		// 	console.log(notices);
		// 	return res.status(200).json({ notices, allVisitedFlag: true })
		// }
		
		// if(lastReadTime){
		// 	const currentTime = Date.now()
		// 	const notices = await Notice.find({'postedOn' : { $gt : lastReadTime, $lte: currentTime }}).sort({_id: -1}).limit(15);
		// 	const deletePastFlag = notices.length < 15 ? false : true;
		// 	return res.status(200).json({ notices, deletePastFlag })
		// } else if( endReadTime ) {
		// 	const notices = await Notice.find({'postedOn' : { $lt : endReadTime }}).sort({_id: -1}).limit(pageSize);
		// 	const allVisitedFlag = notices.length < pageSize ? true : false;
		// 	return res.status(200).json({ notices, allVisitedFlag })
		// } {
		// 	const notices = await Notice.find({})
		// 	.sort({ _id: -1 })
		// 	.limit(pageSize)
		// 	.skip(pageSize * parseInt(page));
		// 	return res.status(200).json({ notices, deletePastFlag: false });
		// }

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
		const { username, role } = req.data;
		if(role == "USER"){
			return res.status(401).json({ message: "PLEASE SUBSCRIBE FOR ADDING YOUR POSTS" });
		}
		const {postLimit, profileImage} = await User.findOne({ username }, {postLimit:1, profileImage:1, _id:0});
		if (postLimit > 0) {
			let fileURL;
			if (req.file) {
				const imageData = await cloudinary.uploader.upload(req.file.path, {
					folder: "DigitalKanzara/files/",
					transformation: { width: 1080, height: 720, crop: "scale" },
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
			res.status(201).json({ message: "Post Added Successfully" });
		} else {
			res.status(500).json({message: "Your posting limit is exhausted"})
		}
	} catch (error) {
		console.error(error);
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
		console.error(error);
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
