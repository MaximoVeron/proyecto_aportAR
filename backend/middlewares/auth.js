import { verifyToken } from "../utils/jwt.js";
import { ErrorResponse } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/errorHandler.js";
import User from "../models/User.js";

// Proteger rutas - verificar que el usuario esté autenticado
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Verificar si el token viene en las cookies o en el header
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Verificar que existe el token
  if (!token) {
    return next(
      new ErrorResponse("No autorizado para acceder a esta ruta", 401)
    );
  }

  try {
    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new ErrorResponse("Token inválido", 401));
    }

    // Obtener usuario del token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse("Usuario no encontrado", 404));
    }

    next();
  } catch (error) {
    return next(
      new ErrorResponse("No autorizado para acceder a esta ruta", 401)
    );
  }
});

// Restringir acceso a roles específicos
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `El rol ${req.user.role} no tiene permiso para acceder a esta ruta`,
          403
        )
      );
    }
    next();
  };
};
