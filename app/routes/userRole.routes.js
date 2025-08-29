import express from "express";

import {
  assignRoleToUser,
  getAllUserRoles
} from "../controllers/userRole.controller.js";

const userRoleRoutes = express.Router();

userRoleRoutes.post("/", assignRoleToUser);

userRoleRoutes.get("/", getAllUserRoles);

export default userRoleRoutes;
