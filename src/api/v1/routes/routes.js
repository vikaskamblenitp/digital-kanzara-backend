const express = require("express");
const router = express.Router();
const notFound = require("../../../middlewares/not-found");
const authMiddleware = require('../../../middlewares/auth')
const {uploadMiddleware} =require("../../../middlewares/upload.middleware")
const { login, signup, tokenValidity, updateProfile } = require("../controllers/user");
const {
	getAllNotices,
	getUserNotices,
	addNotice,
	getNotice,
	editNotice,
	deleteNotice
} = require("../controllers/notice");

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/tokenValidity").post(tokenValidity);
router.route("/updateProfile").patch(authMiddleware,uploadMiddleware("profile"),updateProfile);
router.route("/notices").get(getAllNotices); //get all notices
router.route("/get-my-notices").get(getUserNotices);
router.route("/addNotice").post(authMiddleware, uploadMiddleware("file"), addNotice); //add notice
router.route("/:id").get(getNotice).patch(authMiddleware, uploadMiddleware("file"), editNotice).delete(authMiddleware, deleteNotice); //with id 1.getNotice 2.editNotice 3.deleteNotice
router.route(notFound);


module.exports = {
	versionRoutes: router,
};
