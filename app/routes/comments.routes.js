import { Router } from "express";
import {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.js";
import {
  createCommentValidation,
  updateCommentValidation,
} from "../middlewares/validations/comments.validation.js";
import { applyValidations } from "../middlewares/applyValidation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const commentRouter = Router();

commentRouter.post(
  "/comments",
  authMiddleware,
  createCommentValidation,
  applyValidations,
  createComment
);
commentRouter.get("/comments", getComments); // Público - para ver comentarios
commentRouter.get("/comments/:id", getCommentById); // Público - para ver un comentario
commentRouter.put(
  "/comments/:id",
  authMiddleware,
  updateCommentValidation,
  applyValidations,
  updateComment
);
commentRouter.delete("/comments/:id", authMiddleware, deleteComment);

export default commentRouter;
