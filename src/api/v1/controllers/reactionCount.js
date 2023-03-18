const Comment = require("../models/comment");
const Dislike = require("../models/dislike");
const Like = require("../models/like");
const User = require("../models/user")

const reactionCount = async (req, res) => {
	try {
		const { _id, username } = req.query;
		const userReactions = await User.find(
			{ username },
			{ likes: 1, dislikes: 1, _id: 0 }
		);
		const liked = userReactions[0].likes.some((field) => field.postId === _id)
			? "like"
			: undefined;
		const disliked = userReactions[0].dislikes.some(
			(field) => field.postId === _id
		)
			? "dislike"
			: undefined;
		const lCount = await Like.find({ postId: _id }, { count: 1, _id: 0 });
		const dCount = await Dislike.find({ postId: _id }, { count: 1, _id: 0 });
		const cCount = await Comment.find({ postId: _id }, { count: 1, _id: 0 });

		const likeCount = lCount[0] ? lCount[0].count : 0;
		const dislikeCount = dCount[0] ? dCount[0].count : 0;
		const commentCount = cCount[0] ? cCount[0].count : 0;
		res
			.status(200)
			.json({ likeCount, dislikeCount, commentCount, liked, disliked });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error });
	}
};

module.exports = reactionCount;
