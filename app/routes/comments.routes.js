import { Router } from "express";
import {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.js";

const commentRouter = Router();

commentRouter.post("/comments", createComment);
commentRouter.get("/comments", getComments);
commentRouter.get("/comments/:id", getCommentById);
commentRouter.put("/comments/:id", updateComment);
commentRouter.delete("/comments/:id", deleteComment);

export default commentRouter;
