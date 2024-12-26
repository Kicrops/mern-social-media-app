import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		dateOfBirth: {
			type: Date,
			required: true,
		},
		location: {
			type: String,
			default: "",
		},
		bio: {
			type: String,
			default: "",
		},
		profilePicture: {
			type: String,
			default: "",
		},
		posts: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Post",
		},
		following: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
		},
		followers: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
