import { Router } from "express";
import {
  createStrike,
  getStrikes,
  getStrikeById,
  updateStrike,
  deleteStrike,
} from "../controllers/strikes.controller.js";

const strikeRouter = Router();

strikeRouter.post("/strikes", createStrike);
strikeRouter.get("/strikes", getStrikes);
strikeRouter.get("/strikes/:id", getStrikeById);
strikeRouter.put("/strikes/:id", updateStrike);
strikeRouter.delete("/strikes/:id", deleteStrike);

export default strikeRouter;
