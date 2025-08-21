import express from "express";

import {
  createProfile,
  getAllProfiles,
} from "../controllers/profile.controller.js";

const profileRoutes = express.Router();

profileRoutes.post("/", createProfile);
profileRoutes.get("/", getAllProfiles);

export default profileRoutes;
