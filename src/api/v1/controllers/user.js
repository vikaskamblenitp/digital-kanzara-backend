const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const fs = require("fs");
const { cloudinary } = require("@configs/cloudinary.js");
const User = require("../models/user");
const count = require("./Counter");

const login = async (req, res) => {
	try {
		await count("login")
		console.log(req.headers);
		const { username, password } = req.body;
		console.log(username);
		const user = await User.findOne({ username: username });
		console.log(user);
		if (!user) {
			throw new Error("user not exist");
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			throw new Error("Username or password is wrong");
		}
		const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
			expiresIn: "365d",
		});
		res.status(200).json({
			token: token,
			username: user.username,
			userID: user._id,
			profileImage: user.profileImage,
		});
	} catch (error) {
		res.status(401).json({
			msg: error.message,
		});
	}
};

const signup = async (req, res) => {
	try {
		await count("signup")
		const { name, phone, username, password } = req.body;
		const user = await User.findOne({ username: username });
		if (user) {
			throw new Error("user already exists");
		}
		const hash = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
		console.log("hash:", hash);
		const newUser = await User.create({name, phone, username, password: hash });
		const token = jwt.sign({ username }, process.env.JWT_SECRET, {
			expiresIn: "365d",
		});
		res.status(200).json({
			user: newUser,
			token: token,
		});
	} catch (error) {
		res.status(401).json({
			msg: error.message,
		});
	}
};
// rename to fetch user
const tokenValidity = async (req, res) => {
	try {
		await count("tokenValidity")
		const { token } = req.body;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		res.status(200).json({ username: decoded.username });
	} catch (error) {
		res.status(401).json({
			msg: error.message,
		});
	}
};

const updateProfile = async (req, res) => {
	try {
		await count("updateProfile")
		const { username } = req.user;
		const response = await cloudinary.uploader.upload(req.file.path, {
			folder: "DigitalKanzara/profile/",
			public_id: username,
			version: Date.now(),
			transformation: { width: 300, height: 300, crop: "scale" },
		});
		console.log("response:", response);
		const filename = response.url;
		const newUser = await User.findOneAndUpdate(
			{ username: username },
			{ profileImage: filename }
		);
		// if(!response.profileImage)
		// fs.unlink(`.data/profile/${response.profileImage}`,(err)=>{console.log(err)})

		res.status(201).json({ profileImage: filename });
	} catch (error) {
		console.log("err:", error);
		res.status(500).json({ msg: error.message });
	}
};

module.exports = {
	login,
	signup,
	tokenValidity,
	updateProfile,
};
