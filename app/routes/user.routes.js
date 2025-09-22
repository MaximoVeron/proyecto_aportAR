import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import {
  createUserValidation,
  updateUserValidation,
  userIdValidation,
} from "../controllers/middlewares/validations/user.validation.js";

const userRouter = Router();

userRouter.post("/users", createUserValidation, createUser);
userRouter.get("/users", getUsers);
userRouter.get("/users/:id", userIdValidation, getUserById);
userRouter.put(
  "/users/:id",
  userIdValidation,
  updateUserValidation,
  updateUser
);
userRouter.delete("/users/:id", userIdValidation, deleteUser);

export default userRouter;
