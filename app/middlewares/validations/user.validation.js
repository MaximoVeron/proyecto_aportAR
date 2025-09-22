import { body, param } from "express-validator";
import {
  emailExist,
  updateEmailExist,
  userExist,
} from "./custom/user.custom.js";

export const createUserValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(emailExist)
    .trim()
    .toLowerCase()
    .normalizeEmail(),
  body("password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  body("profile.first_name")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "First name must be at least 3 characters long and at most 50 characters long"
    )
    .isString()
    .withMessage("First name must be a string")
    .trim()
    .escape(),
  body("profile.last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "Last name must be at least 3 characters long and at most 50 characters long"
    )
    .isString()
    .withMessage("Last name must be a string")
    .trim()
    .escape(),
  body("profile.biography")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Biography must be at most 500 characters long")
    .isString()
    .withMessage("Biography must be a string")
    .trim()
    .escape(),
  body("role")
    .optional()
    .isString()
    .withMessage("Role must be a string")
    .isIn(["user", "admin", "mod", "profesor"]) //que pasa ssi el usario no envia el rol? pero si un string
    .withMessage("Invalid role")
    .trim()
    .escape()
    .toLowerCase(),
];

export const updateUserValidation = [
  body("email")
    .optional()
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(updateEmailExist)
    .trim()
    .toLowerCase()
    .normalizeEmail(),
  body("password")
    .optional()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  body("profile.first_name")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "First name must be at least 3 characters long and at most 50 characters long"
    )
    .isString()
    .withMessage("First name must be a string")
    .trim()
    .escape(),
  body("profile.last_name")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "Last name must be at least 3 characters long and at most 50 characters long"
    )
    .isString()
    .withMessage("Last name must be a string")
    .trim()
    .escape(),
  body("profile.biography")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Biography must be at most 500 characters long")
    .isString()
    .withMessage("Biography must be a string")
    .trim()
    .escape(),
  body("role")
    .optional()
    .isString()
    .withMessage("Role must be a string")
    .isIn(["user", "admin", "mod", "profesor"]) //que pasa ssi el usario no envia el rol? pero si un string
    .withMessage("Invalid role")
    .trim()
    .escape()
    .toLowerCase(),
];

export const userIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user ID format")
    .custom(userExist),
];
