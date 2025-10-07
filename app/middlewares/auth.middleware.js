import { verifyToken } from "../helpers/jwt.helper.js";

export const authMiddleware = (req, res, next) => {
  try {
    // Obtener token de la cookie
    const token = req.cookies["token"];
    if (!token) {
      return res.status(401).json({ message: "No autenticado, jeje" });
    }
    // Verificar y decodificar token
    const decoded = verifyToken(token);
    // Almacenar datos del usuario
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};
