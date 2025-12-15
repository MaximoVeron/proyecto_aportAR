// Clase personalizada para errores
export class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Middleware de manejo de errores
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Error de Mongoose: CastError (ID inválido)
  if (err.name === "CastError") {
    const message = "Recurso no encontrado";
    error = new ErrorResponse(message, 404);
  }

  // Error de Mongoose: Duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `El ${field} ya está registrado`;
    error = new ErrorResponse(message, 400);
  }

  // Error de Mongoose: Validación
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Error del servidor",
  });
};

// Async handler para evitar try-catch repetitivos
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
