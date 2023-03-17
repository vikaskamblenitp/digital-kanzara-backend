const { default: mongoose } = require("mongoose");

const commentSchema = new mongoose.Schema({
	postId: String,
	comments: [
		{
			username: String,
			comment: String,
      time: Number
		},
	],
	count: {type: Number, default: 0}
});

module.exports = mongoose.model("Comment", commentSchema);
