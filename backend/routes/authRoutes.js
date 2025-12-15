import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  getUsers,
  getUsersByCareerAndYear,
} from "../controllers/authController.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";

const router = express.Router();

// Validaciones
const registerValidation = [
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("career")
    .optional()
    .isIn([
      "Software",
      "Telecomunicaciones",
      "Química Industrial",
      "Mecatrónica",
    ]),
  body("academicYear").optional().isIn(["1", "2", "3"]),
];

const loginValidation = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

const updatePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("La contraseña actual es obligatoria"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
];

// Rutas públicas
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);

// Rutas protegidas
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/updateprofile", protect, updateProfile);
router.put(
  "/updatepassword",
  protect,
  updatePasswordValidation,
  validate,
  updatePassword
);

// Rutas de admin
router.get("/users", protect, authorize("admin"), getUsers);
router.get(
  "/users/filter",
  protect,
  authorize("admin"),
  getUsersByCareerAndYear
);

export default router;
