const express = require("express");
const router = express.Router();
const notFound = require("../../../middlewares/not-found");
const authMiddleware = require('../../../middlewares/auth')
const {uploadMiddleware} = require("../../../middlewares/upload.middleware")
const {addComment, getComments} = require("../controllers/comment");
const {addLike, addDislike, getLikes} = require("../controllers/like");

const { login, signup, updateProfile, getProfileURL, storeExpoToken } = require("../controllers/user");
const {
	getAllNotices,
	getCountOfPosts,
	getUserNotices,
	addNotice,
	getNotice,
	editNotice,
	deleteNotice
} = require("../controllers/notice");
const reactionCount = require("../controllers/reactionCount");

router.route("/post/:postId/comments").get(getComments).post(addComment);
router.route("/post/:postId/likes").get(getLikes).post(addLike);
router.route("/post/:postId/dislike").post(addDislike);
router.route("/get-reaction-count").get(reactionCount)
router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/store-token").post(storeExpoToken);
router.route("/updateProfile").patch(authMiddleware,uploadMiddleware("profile"),updateProfile);
router.route("/get-profile-url").get(getProfileURL);
router.route("/notices").get(getAllNotices); //get all notices
router.route("/post-count").get(getCountOfPosts);
router.route("/get-my-notices").get(getUserNotices);
router.route("/addNotice").post(authMiddleware, uploadMiddleware("file"), addNotice); //add notice
router.route("/post/:id").get(getNotice).patch(authMiddleware, uploadMiddleware("file"), editNotice).delete(authMiddleware, deleteNotice); //with id 1.getNotice 2.editNotice 3.deleteNotice
router.route(notFound);


module.exports = {
	versionRoutes: router,
};
