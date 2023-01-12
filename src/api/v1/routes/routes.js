const express = require("express");
const router = express.Router();
const notFound = require("../../../middlewares/not-found");
const authMiddleware = require('../../../middlewares/auth')
const {uploadMiddleware} =require("../../../middlewares/upload.middleware")
const {addComment, getComments} = require("../controllers/comment");
const {addLike, addDislike} = require("../controllers/like");

const { login, signup, tokenValidity, updateProfile, getProfileURL } = require("../controllers/user");
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

router.route("/add-comment").post(addComment);
router.route("/add-like").post(addLike);
router.route("/add-dislike").post(addDislike);
router.route("/get-comments").get(getComments);
router.route("/get-reaction-count").get(reactionCount)
router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/tokenValidity").post(tokenValidity);
router.route("/updateProfile").patch(authMiddleware,uploadMiddleware("profile"),updateProfile);
router.route("/get-profile-url").get(getProfileURL);
router.route("/notices").get(getAllNotices); //get all notices
router.route("/post-count").get(getCountOfPosts);
router.route("/get-my-notices").get(getUserNotices);
router.route("/addNotice").post(authMiddleware, uploadMiddleware("file"), addNotice); //add notice
router.route("/:id").get(getNotice).patch(authMiddleware, uploadMiddleware("file"), editNotice).delete(authMiddleware, deleteNotice); //with id 1.getNotice 2.editNotice 3.deleteNotice
router.route(notFound);


module.exports = {
	versionRoutes: router,
};
