const Counter = require("../models/counter");

const count = async (apiName) => {
	const id = "639423ec48122023803e21fc";
    var data = {};
    data[apiName] = 1;

	try {
	   await Counter.updateOne(
	        { _id: id },
	        { $inc: data}
	    );
	} catch (error) {
	    console.log(error);
	}
    /*
	const body = {
		getAllNotices: 1,
		getUserNotices: +0,
		getNotice: +0,
		addNotice: +0,
		editNotice: +0,
		deleteNotice: +0,
		login: +0,
		signup: +0,
		tokenValidity: +0,
		updateProfile: +0,
	};
	const counter = await Counter.create(body);
    console.log(counter)
	return counter;*/
};

module.exports = count;
