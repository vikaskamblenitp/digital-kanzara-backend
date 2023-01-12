const { default: mongoose } = require("mongoose");

const likeSchema = new mongoose.Schema({
	postId: String,
	likes: [{ username: String, time: Number }],
	count: {
		type: Number,
		default: 0,
	},
});

module.exports = new mongoose.model("Like", likeSchema);
