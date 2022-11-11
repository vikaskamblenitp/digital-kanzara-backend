const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
	try {
		console.log(req.headers)
		const authHeader = req.headers.authorization;
		console.log(authHeader)
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new Error("token not provided");
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ msg: error.message, error: error });
	}
};

module.exports = authMiddleware;
