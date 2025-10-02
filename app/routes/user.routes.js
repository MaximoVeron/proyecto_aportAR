import { Router } from "express";
import {
  getUsers,
  getUserById,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/users", authMiddleware, getUsers);
userRouter.get("/users/:id", authMiddleware, getUserById);
userRouter.delete("/users/:id", authMiddleware, deleteUser);

export default userRouter;
