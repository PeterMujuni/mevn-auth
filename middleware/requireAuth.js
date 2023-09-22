const jwt = require("jsonwebtoken");
const HttpError = require("../models/httpError");

const requireAuth = async (req, res, next) => {
	if (req.method === "OPTIONS") {
		return next();
	}
	
	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			throw new Error("No token exists");
		}

		const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
		req.userData = { userId: decodeToken.userId };
		// console.log(user);
		next();
	} catch (error) {
		return next(new HttpError("Authentication failed", 401));
	}
};

module.exports = requireAuth;