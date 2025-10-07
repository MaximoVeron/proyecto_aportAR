import { PublicationModel } from "../models/publications.model.js";

// * middleware para verificar si el usuario autenticado es responsable de un recurso
export const responsibleMiddleware = async (req, res, next) => {
  try {
    const publicationId = req.params.id;
    const foundPublication = await PublicationModel.findById(publicationId);
    if (!foundPublication)
      return res.status(404).json({ msg: "Recurso no encontrado" });

    if (String(foundPublication.author) !== String(req.user.id))
      return res
        .status(403)
        .json({ msg: "No tienes permisos para acceder a este recurso" });

    next();
  } catch (error) {
    return res.status(500).json({ msg: "Error Interno del servidor" });
  }
};
