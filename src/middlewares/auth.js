const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new Error("token not provided");
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.data = decoded;
		next();
	} catch (error) {
		res.status(401).json({ msg: error.message, error: error });
	}
};

module.exports = authMiddleware;
