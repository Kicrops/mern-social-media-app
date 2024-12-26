import mongoose from "mongoose";

const postSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: "",
		},
		image: {
			type: String,
			default: "",
		},
		likes: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
		},
		comments: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "User",
				},
				text: {
					type: String,
					required: true,
				},
				date: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Post", postSchema);

export default Post;
