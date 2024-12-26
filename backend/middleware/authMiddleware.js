import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const expTimeLeft = decoded.exp * 1000 - Date.now();
			if (expTimeLeft < 0) {
				return res.status(401).json({ success: false, message: "Not authorized, token expired" });
			}
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ success: false, message: "Not authorized, token expired" });
			}
			console.error("Error in protect: ", error);
			res.status(401).json({ success: false, message: "Not authorized, token failed" });
		}
	} else if (!token) {
		res.status(401).json({ success: false, message: "Not authorized, no token" });
	}
};
