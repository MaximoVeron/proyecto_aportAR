import express from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers.js";

const userRoutes = express.Router();

userRoutes.post("/", createUser);
userRoutes.get("/", getAllUsers);
userRoutes.get("/:id", getUserById);
userRoutes.put("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
