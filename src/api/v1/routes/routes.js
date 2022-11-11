const express = require("express");
const router = express.Router();
const notFound = require("../../../middlewares/not-found");
const authMiddleware = require('../../../middlewares/auth')
const { login, signup } = require("../controllers/user");
const {
	getAllNotices,
	addNotice,
	getNotice,
	editNotice,
	deleteNotice
} = require("../controllers/notice");

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/notices").get(getAllNotices); //get all notices
router.route("/addNotice").post(authMiddleware, addNotice); //add notice
router.route("/:id").get(getNotice).patch(authMiddleware, editNotice).delete(authMiddleware, deleteNotice); //with id 1.getNotice 2.editNotice 3.deleteNotice
router.route(notFound);


module.exports = {
	versionRoutes: router,
};
