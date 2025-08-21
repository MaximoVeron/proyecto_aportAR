import express from "express";

import {
  createRole,
  getAllRoles,
} from "../controllers/role.controllers.js";

const rolesRoutes = express.Router();

rolesRoutes.post("/", createRole);
rolesRoutes.get("/", getAllRoles);

export default rolesRoutes;
