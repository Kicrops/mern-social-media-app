import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const getPosts = async (req, res) => {
	try {
		const posts = await Post.find({});
		res.status(200).json({ success: true, data: posts });
	} catch (error) {
		console.error("Error in getPosts: ", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getPostById = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ success: false, message: "Post not found with the provided ID" });
		}
		res.status(200).json({ success: true, data: post });
	} catch (error) {
		console.error("Error in getPostById: ", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getPostsByUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found with the provided ID" });
		}
		const posts = await Post.find({ user: user._id });
		res.status(200).json({ success: true, data: posts });
	} catch (error) {
		console.error("Error in getPostsByUser: ", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getPostsByFollowing = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found with the provided ID" });
		}
		const posts = await Post.find({ user: { $in: user.following } });
		res.status(200).json({ success: true, data: posts });
	} catch (error) {
		console.error("Error in getPostsByFollowing: ", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createPost = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found with the provided ID" });
		}
		const title = req.body.title;
		if (!title) {
			return res.status(400).json({ success: false, message: "Title is required" });
		}
		const post = await Post.create({ ...req.body, user: user._id });
		user.posts.push(post._id);
		await user.save();
		res.status(201).json({ success: true, data: post });
	} catch (error) {
		console.error("Error in createPost: ", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const updatePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ success: false, message: "Post not found with the provided ID" });
		}
		const title = req.body.title;
		if (!title) {
			return res.status(400).json({ success: false, message: "Title is required" });
		}
		const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.status(200).json({ success: true, data: updatedPost });
	} catch (error) {
		console.error("Error in updatePost: ", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ success: false, message: "Post not found with the provided ID" });
		}
		const user = await User.findById(post.user);
		await Post.findByIdAndDelete(req.params.id);
		user.posts = user.posts.filter((postId) => postId.toString() !== req.params.id);
		await user.save();
		res.status(200).json({ success: true, data: "Post deleted succesfully" });
	} catch (error) {
		console.error("Error in deletePost: ", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const likePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		const user = await User.findById(req.body.id);
		if (!post || !user) {
			return res.status(404).json({ success: false, message: "Post or User not found with the provided ID" });
		}
		if (post.likes.includes(user._id)) {
			return res.status(400).json({ success: false, message: "You already liked this post" });
		}
		post.likes.push(user._id);
		await post.save();
		const updatedPost = await Post.findById(req.params.id);
		res.status(200).json({ success: true, data: updatedPost });
	} catch (error) {
		console.error("Error in likePost: ", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const unlikePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		const user = await User.findById(req.body.id);
		if (!post || !user) {
			return res.status(404).json({ success: false, message: "Post or User not found with the provided ID" });
		}
		if (!post.likes.includes(user._id)) {
			return res.status(400).json({ success: false, message: "You have not liked this post" });
		}
		post.likes = post.likes.filter((like) => like.toString() !== user._id.toString());
		await post.save();
		const updatedPost = await Post.findById(req.params.id);
		res.status(200).json({ success: true, data: updatedPost });
	} catch (error) {
		console.error("Error in unlikePost: ", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const commentPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		const user = await User.findById(req.body.id);
		if (!post || !user) {
			return res.status(404).json({ success: false, message: "Post or User not found with the provided ID" });
		}
		const text = req.body.text;
		if (!text) {
			return res.status(400).json({ success: false, message: "Text is required" });
		}
		post.comments.push({ user: user._id, text, date: Date.now() });
		await post.save();
		res.status(200).json({ success: true, data: post });
	} catch (error) {
		console.error("Error in commentPost: ", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const uncommentPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		const comment = post.comments.find((comment) => comment._id.toString() === req.body.commentId);
		if (!post || !comment) {
			return res.status(404).json({ success: false, message: "Post or Comment not found with the provided ID" });
		}
		post.comments = post.comments.filter((comment) => comment._id.toString() !== req.body.commentId);
		await post.save();
		res.status(200).json({ success: true, data: post });
	} catch (error) {
		console.error("Error in uncommentPost: ", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
