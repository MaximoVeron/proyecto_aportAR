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
} from "../middlewares/validations/user.validation.js";
import { applyValidations } from "../middlewares/applyValidation.js";

const userRouter = Router();

userRouter.post("/users", createUserValidation, applyValidations, createUser);
userRouter.get("/users", getUsers);
userRouter.get("/users/:id", userIdValidation, applyValidations, getUserById);
userRouter.put(
  "/users/:id",
  userIdValidation,
  updateUserValidation,
  applyValidations,
  updateUser
);
userRouter.delete("/users/:id", userIdValidation, applyValidations, deleteUser);

export default userRouter;
