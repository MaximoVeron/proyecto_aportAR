import { body, param } from "express-validator";
import { userExist } from "./custom/user.custom.js";
import { publicationExist } from "./custom/publication.custom.js";

export const createCommentValidation = [
  body("author")
    .notEmpty()
    .withMessage("El comentario debe tener un autor")
    .isMongoId()
    .withMessage("El id debe ser valido")
    .custom(userExist),
  body("content")
    .notEmpty()
    .withMessage("El comentario no puede estar vacio")
    .isString()
    .withMessage("El contenido debe de ser un string")
    .isLength({ min: 3, max: 500 })
    .withMessage("El comentario debe tener entre 3 a 500 caracteres")
    .trim()
    .escape(),
  body("publicacion")
    .notEmpty()
    .withMessage("El comentario debe tener un autor")
    .isMongoId()
    .withMessage("El id debe ser valido")
    .custom(publicationExist),
];

export const updateCommentValidation = [
  body("author")
    .not()
    .exists()
    .withMessage("El comentario no puede cambiar de autor"),
  body("content")
    .notEmpty()
    .withMessage("El comentario no puede estar vacio")
    .isString()
    .withMessage("El contenido debe de ser un string")
    .isLength({ min: 3, max: 500 })
    .withMessage("El comentario debe tener entre 3 a 500 caracteres")
    .trim()
    .escape(),
  body("publicacion")
    .not()
    .exists()
    .withMessage("El comentario no puede cambiar de publicacion"),
];
