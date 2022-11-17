const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const User = require("../models/user");

const login = async (req, res) => {
	try {
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
			expiresIn: "30d",
		});
		console.log(token);
		res.status(200).json({
			msg: "Login successfully",
			token: token,
			username: user.username,
			profileImage: user.profileImage
		});
	} catch (error) {
		res.status(401).json({
			msg: error.message,
		});
	}
};

const signup = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username: username });
		if (user) {
			throw new Error("user already exists");
		}
		const hash = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
		console.log("hash:", hash);
		const newUser = await User.create({ username: username, password: hash });
		const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
			expiresIn: "30d",
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

const tokenValidity = async (req, res) => {
	try {
		const { token } = req.body;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decoded);
		res.status(200).json({ username: decoded.username });
	} catch (error) {
		res.status(401).json({
			msg: error.message,
		});
	}
};

const updateProfile = async (req, res) => {
	try {
		console.log("body==>",req.body)
		console.log("file==>",req.file);
		console.log("user==>",req.user);
		const { username } = req.user;
		console.log(req.file)
		const filename = req.file.filename;
		const response = await User.findOneAndUpdate(
			{ username: username },
			{ profileImage: filename }
		);
		fs.unlink(`.data/profile/${response.profileImage}`,(err)=>{console.log(err)})
		response.profileImage = filename;
		res.status(201).json({response});
	} catch (error) {
		console.log("err:", error)
		res.status(500).json({ msg: error.message });
	}
};

module.exports = {
	login,
	signup,
	tokenValidity,
	updateProfile,
};
