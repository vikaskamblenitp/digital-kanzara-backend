const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cloudinary } = require("@configs/cloudinary.js");
const User = require("../../models/user");
const count = require("../Counter");
const {_getProfileURL} = require("./user");
const token = require("../../models/token");

const login = async (req, res) => {
	try {
		await count("login")
		const { username, password } = req.body;
		const user = await User.findOne({ username: username });
		if (!user) {
			throw new Error("user not exist");
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			throw new Error("Username or password is wrong");
		}
		const token = jwt.sign({ username: username, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: "365d",
		});
		res.status(200).json({
			token: token,
			username: user.username,
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
		console.log({ name, phone, username, password });

		const user = await User.findOne({ username: username });
		if (user) {
			throw new Error("user already exists");
		}
		console.log("DONE WITH DUPLICATE CHECK")
		const hash = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
		
		const newUser = await User.create({name, phone, username, password: hash });
		const token = jwt.sign({ username }, process.env.JWT_SECRET, {
			expiresIn: "365d",
		});
		res.status(200).json({
			token: token,
			username: newUser.username,
			profileImage: newUser.profileImage,
		});
	} catch (error) {
		console.error(error);
		res.status(401).json({
			msg: error.message,
		});
	}
};

const updateProfile = async (req, res) => {
	try {
		await count("updateProfile")
		const { username } = req.data;
		const response = await cloudinary.uploader.upload(req.file.path, {
			folder: "DigitalKanzara/profile/",
			public_id: username,
			version: Date.now(),
			transformation: { width: 300, height: 300, crop: "scale" },
		});
		const url = response.url;
		res.status(201).json({ profileImage: url });
		await User.findOneAndUpdate(
			{ username: username },
			{ profileImage: url }
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

const getProfileURL = async (req, res) => {
	try {
		const { username } = req.query;
		const profileImage = await _getProfileURL(username);
		res.status(200).json(profileImage);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: error.message });
	}
}

const increasePostCount = async (req, res) => {
	try {
		const { username, value } = req.body;
		await User.findOneAndUpdate({username},{ $inc: {postLimit: value}})
		res.status(200).json({ msg: "success" });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
}

const storeExpoToken = async (req, res) => {
	try {
		console.log(req.body);
		await token.create({token: req.body.token});
		res.status(201).json({message: "Success"})
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

module.exports = {
	login,
	signup,
	updateProfile,
	getProfileURL,
	increasePostCount,
	storeExpoToken
};
