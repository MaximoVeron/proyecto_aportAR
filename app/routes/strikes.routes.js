import { Router } from "express";
import {
  createStrike,
  getStrikes,
  getStrikeById,
  updateStrike,
  deleteStrike,
} from "../controllers/strikes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const strikeRouter = Router();

strikeRouter.post("/strikes", authMiddleware, createStrike);
strikeRouter.get("/strikes", authMiddleware, getStrikes); // Solo moderadores/admins
strikeRouter.get("/strikes/:id", authMiddleware, getStrikeById); // Solo moderadores/admins
strikeRouter.put("/strikes/:id", authMiddleware, updateStrike); // Solo moderadores/admins
strikeRouter.delete("/strikes/:id", authMiddleware, deleteStrike); // Solo moderadores/admins

export default strikeRouter;
