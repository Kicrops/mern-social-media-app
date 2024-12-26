import express from "express";
import { getPosts, getPostById, getPostsByUser, getPostsByFollowing, createPost, updatePost, deletePost, likePost, unlikePost, commentPost, uncommentPost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const postRouter = express.Router();

postRouter.get("/", protect, getPosts);
postRouter.get("/:id", protect, getPostById);
postRouter.get("/user/:id", protect, getPostsByUser);
postRouter.get("/following/:id", protect, getPostsByFollowing);
postRouter.post("/:id", protect, createPost);
postRouter.put("/:id", protect, updatePost);
postRouter.delete("/:id", protect, deletePost);
postRouter.put("/:id/like", protect, likePost);
postRouter.put("/:id/unlike", protect, unlikePost);
postRouter.put("/:id/comment", protect, commentPost);
postRouter.put("/:id/uncomment", protect, uncommentPost);

export default postRouter;
