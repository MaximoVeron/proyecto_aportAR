import { body, param } from "express-validator";
import { userExist } from "./custom/user.custom.js";
import { publicationExist } from "./custom/publication.custom.js";

export const createPublicationValidation = [
  body("author")
    .isMongoId()
    .withMessage("El ID del autor debe ser un ID de MongoDB válido")
    .custom(userExist),
  body("title")
    .isString()
    .withMessage("El título debe ser una cadena de texto")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El título debe tener entre 3 y 100 caracteres")
    .trim()
    .escape(),
  body("content")
    .optional()
    .isString()
    .withMessage("El contenido debe ser una cadena de texto")
    .isLength({ max: 500 })
    .withMessage("El contenido no debe exceder los 500 caracteres")
    .trim()
    .escape(),
  body("publication_image")
    .optional()
    .isString()
    .withMessage("La imagen de la publicación debe ser una cadena de texto"),
  body("publication_type")
    .notEmpty()
    .withMessage("El tipo de publicación es obligatorio")
    .isString()
    .isIn(["proyecto", "sugerencia", "problematica"])
    .withMessage("El tipo de publicación es inválido"),
  body("status")
    .optional()
    .isString()
    .isIn(["in_progress", "resolved"])
    .withMessage("El estado es inválido"),
];

export const updatePublicationValidation = [
  body("author")
    .isEmpty()
    .withMessage("No se puede cambiar el autor de la publicación"),
  body("title")
    .optional()
    .isString()
    .withMessage("El título debe ser una cadena de texto")
    .isLength({ min: 3, max: 100 })
    .withMessage("El título debe tener entre 3 y 100 caracteres")
    .trim()
    .escape(),
  body("content")
    .optional()
    .isString()
    .withMessage("El contenido debe ser una cadena de texto")
    .isLength({ max: 500 })
    .withMessage("El contenido no debe exceder los 500 caracteres")
    .trim()
    .escape(),
  body("publication_image")
    .optional()
    .isString()
    .withMessage("La imagen de la publicación debe ser una cadena de texto"),
  body("publication_type")
    .optional()
    .isString()
    .isIn(["proyecto", "sugerencia", "problematica"])
    .withMessage("El tipo de publicación es inválido"),
  body("status")
    .optional()
    .isString()
    .isIn(["in_progress", "resolved"])
    .withMessage("El estado es inválido"),
];

export const publicationIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("El ID de la publicación debe ser un ID de MongoDB válido")
    .custom(publicationExist),
];
