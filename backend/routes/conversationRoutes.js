import express from "express";
import { body } from "express-validator";
import {
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
  getAvailableUsers,
  deleteConversation,
  getUnreadCount,
} from "../controllers/conversationController.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";

const router = express.Router();

// Validaciones
const createConversationValidation = [
  body("participantId")
    .notEmpty()
    .withMessage("El ID del participante es obligatorio"),
];

const sendMessageValidation = [
  body("content").optional().trim(),
  body("fileUrl").optional().isURL().withMessage("URL de archivo inválida"),
];

// Rutas de conversaciones
router.get("/", protect, getConversations);
router.get("/users", protect, getAvailableUsers);
router.get("/unread-count", protect, getUnreadCount);
router.get("/:id", protect, getConversation);
router.post(
  "/",
  protect,
  createConversationValidation,
  validate,
  createConversation
);
router.post(
  "/:id/messages",
  protect,
  sendMessageValidation,
  validate,
  sendMessage
);
router.delete("/:id", protect, deleteConversation);

export default router;
