const { default: mongoose } = require("mongoose");

const dislikeSchema = new mongoose.Schema({
	postId: String,
	dislikes: [{username: {type: String}, time: Number}],
    count: {
        type: Number,
        default: 0
    }
});

module.exports = new mongoose.model("Dislike", dislikeSchema);
