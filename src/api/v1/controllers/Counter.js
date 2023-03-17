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
};

module.exports = count;
