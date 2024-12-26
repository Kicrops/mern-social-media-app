import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
	cors({
		origin: "*",
		methods: "GET,POST,PUT,DELETE",
		allowedHeaders: "Content-Type,Authorization",
	})
);

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html")));
}

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
	connectDB();
});
