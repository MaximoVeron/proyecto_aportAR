import express from "express";
import { body } from "express-validator";
import {
  createQuarter,
  getQuarters,
  getQuarter,
  getMyQuarters,
  updateQuarter,
  deleteQuarter,
  updateAttendance,
  getMyAttendance,
} from "../controllers/quarterController.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";

const router = express.Router();

// Validaciones
const createQuarterValidation = [
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("career").isIn([
    "Software",
    "Telecomunicaciones",
    "Química Industrial",
    "Mecatrónica",
  ]),
  body("year").isIn(["1", "2", "3"]),
  body("subjects")
    .isArray({ min: 1 })
    .withMessage("Debe incluir al menos una materia"),
];

const updateAttendanceValidation = [
  body("userId").notEmpty().withMessage("El ID del usuario es obligatorio"),
  body("subjectId")
    .notEmpty()
    .withMessage("El ID de la materia es obligatorio"),
  body("attended")
    .isInt({ min: 0 })
    .withMessage("Las asistencias deben ser un número válido"),
];

// Rutas de admin
router.post(
  "/",
  protect,
  authorize("admin"),
  createQuarterValidation,
  validate,
  createQuarter
);
router.get("/", protect, authorize("admin"), getQuarters);
router.get("/:id", protect, getQuarter);
router.put("/:id", protect, authorize("admin"), updateQuarter);
router.delete("/:id", protect, authorize("admin"), deleteQuarter);
router.put(
  "/:id/attendance",
  protect,
  authorize("admin"),
  updateAttendanceValidation,
  validate,
  updateAttendance
);

// Rutas de estudiante
router.get("/my/quarters", protect, authorize("estudiante"), getMyQuarters);
router.get(
  "/:id/my/attendance",
  protect,
  authorize("estudiante"),
  getMyAttendance
);

export default router;
