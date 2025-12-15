import { validationResult } from "express-validator";
import { ErrorResponse } from "../utils/errorHandler.js";

// Middleware para validar los resultados de express-validator
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(new ErrorResponse(errorMessages, 400));
  }

  next();
};
