import express from "express";
import { getUsers, getUsersByQuery, getUsersByFollowers, getUsersByFollowing, getUserById, getUserFromToken, registerUser, loginUser, updateUser, deleteUser, followUser, unfollowUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUsers);
userRouter.get("/search/:query", protect, getUsersByQuery);
userRouter.get("/token", protect, getUserFromToken);
userRouter.get("/followers/:id", protect, getUsersByFollowers);
userRouter.get("/following/:id", protect, getUsersByFollowing);
userRouter.get("/:id", protect, getUserById);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/:id", protect, updateUser);
userRouter.delete("/:id", protect, deleteUser);
userRouter.put("/follow/:id", protect, followUser);
userRouter.put("/unfollow/:id", protect, unfollowUser);

export default userRouter;
