import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).json({ success: true, data: users });
	} catch (error) {
		console.error("Error in getUsers: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};

export const getUsersByQuery = async (req, res) => {
	try {
		const users = await User.find({ $or: [{ username: { $regex: req.params.query, $options: "i" } }, { firstName: { $regex: req.params.query, $options: "i" } }, { lastName: { $regex: req.params.query, $options: "i" } }] }).limit(10);
		if (users.length === 0) {
			return res.status(404).json({ success: false, data: "No users found with the provided query" });
		}
		res.status(200).json({ success: true, data: users });
	} catch (error) {
		console.error("Error in getUsersByQuery: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};

export const getUsersByFollowers = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ success: false, data: "User not found with the provided ID" });
		}
		const users = await User.find({ _id: { $in: user.followers } });
		res.status(200).json({ success: true, data: users });
	} catch (error) {
		console.error("Error in getUsersByFollowers: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};

export const getUsersByFollowing = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ success: false, data: "User not found with the provided ID" });
		}
		const users = await User.find({ _id: { $in: user.following } });
		res.status(200).json({ success: true, data: users });
	} catch (error) {
		console.error("Error in getUsersByFollowing: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};

export const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ success: false, data: "User not found with the provided ID" });
		}
		res.status(200).json({ success: true, data: user });
	} catch (error) {
		console.error("Error in getUserById: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};

export const getUserFromToken = async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);
		if (!user) {
			return res.status(404).json({ success: false, data: "User not found with the provided ID" });
		}
		res.status(200).json({ success: true, data: user });
	} catch (error) {
		console.error("Error in getUserFromToken: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};

export const registerUser = async (req, res) => {
	try {
		const { firstName, lastName, username, email, password, dateOfBirth } = req.body;
		const userExists = await User.findOne({
			$or: [{ username: username }, { email: email }],
		});

		if (userExists) {
			return res.status(400).json({ success: false, data: "User already exists" });
		}
		if (!firstName || !lastName || !username || !email || !password || !dateOfBirth) {
			return res.status(400).json({ success: false, data: "All fields are required" });
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ success: false, data: "Invalid email format" });
		}
		if (password.length < 8) {
			return res.status(400).json({ success: false, data: "Password must be at least 8 characters long" });
		}

		const date = new Date(dateOfBirth);
		if (isNaN(date.getTime()) || date > new Date()) {
			return res.status(400).json({ success: false, data: "Invalid date of birth" });
		}

		const user = await User.create(req.body);
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
		res.status(201).json({ success: true, data: { user, token } });
	} catch (error) {
		console.error("Error in registerUser: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ success: false, data: "All fields are required" });
		}
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(404).json({ success: false, data: "User not found with the provided email" });
		}
		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res.status(401).json({ success: false, data: "Invalid password" });
		}
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
		res.status(200).json({ success: true, data: { user, token } });
	} catch (error) {
		console.error("Error in loginUser: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};

export const updateUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ success: false, data: "User not found with the provided ID" });
		}
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.status(200).json({ success: true, data: updatedUser });
	} catch (error) {
		console.error("Error in updateUser: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ success: false, data: "User not found with the provided ID" });
		}
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json({ success: true, data: "User deleted succesfully" });
	} catch (error) {
		console.error("Error in updateUser: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};

export const followUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const currentUser = await User.findById(req.body.id);
		if (!user || !currentUser) {
			return res.status(404).json({ success: false, data: "User not found with the provided ID" });
		}
		if (user.followers.includes(currentUser._id)) {
			return res.status(400).json({ success: false, data: "You already follow this user" });
		}
		user.followers.push(currentUser._id);
		currentUser.following.push(user._id);
		await user.save();
		await currentUser.save();
		res.status(200).json({ success: true, data: user });
	} catch (error) {
		console.error("Error in followUser: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};

export const unfollowUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const currentUser = await User.findById(req.body.id);
		if (!user || !currentUser) {
			return res.status(404).json({ success: false, data: "User not found with the provided ID" });
		}
		if (!user.followers.includes(currentUser._id)) {
			return res.status(400).json({ success: false, data: "You do not follow this user" });
		}
		user.followers = user.followers.filter((id) => id.toString() !== currentUser._id.toString());
		currentUser.following = currentUser.following.filter((id) => id.toString() !== user._id.toString());
		await user.save();
		await currentUser.save();
		res.status(200).json({ success: true, data: user });
	} catch (error) {
		console.error("Error in unfollowUser: ", error);
		res.status(500).json({ success: false, data: "Server Error" });
	}
};
