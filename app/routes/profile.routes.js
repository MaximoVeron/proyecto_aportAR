import { Router } from "express";
import {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} from "../controllers/profiles.controller.js";

const profileRouter = Router();

profileRouter.post("/profiles", createProfile);
profileRouter.get("/profiles", getProfiles);
profileRouter.get("/profiles/:id", getProfileById);
profileRouter.put("/profiles/:id", updateProfile);
profileRouter.delete("/profiles/:id", deleteProfile);

export default profileRouter;
