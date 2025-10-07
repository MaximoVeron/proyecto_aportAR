import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
  updateProfile,
  getProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();
authRouter.post("/auth/register", registerUser);
authRouter.post("/auth/login", loginUser);
authRouter.post("/auth/logout", logout);
authRouter.get("/auth/profile/my", authMiddleware, getProfile);
authRouter.put("/auth/profile", authMiddleware, updateProfile);

export default authRouter;
