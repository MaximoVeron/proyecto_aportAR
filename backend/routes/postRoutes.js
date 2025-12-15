import express from "express";
import { body } from "express-validator";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  likePost,
  voteOnPoll,
} from "../controllers/postController.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";

const router = express.Router();

// Validaciones
const createPostValidation = [
  body("type").isIn([
    "consulta",
    "problematica",
    "proyecto",
    "encuesta",
    "noticia",
  ]),
  body("title").trim().notEmpty().withMessage("El título es obligatorio"),
  body("content").trim().notEmpty().withMessage("El contenido es obligatorio"),
];

const commentValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("El comentario no puede estar vacío"),
];

const voteValidation = [
  body("optionIndex").isInt({ min: 0 }).withMessage("Opción inválida"),
];

// Rutas de publicaciones
router.post("/", protect, createPostValidation, validate, createPost);
router.get("/", protect, getPosts);
router.get("/:id", protect, getPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

// Comentarios
router.post("/:id/comments", protect, commentValidation, validate, addComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

// Likes
router.post("/:id/like", protect, likePost);

// Encuestas
router.post("/:id/vote", protect, voteValidation, validate, voteOnPoll);

export default router;
