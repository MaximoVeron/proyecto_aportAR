import { PublicationModel } from "../models/publications.model.js";
import { matchedData } from "express-validator";

// Crear una nueva publicación
export const createPublication = async (req, res) => {
  try {
    const newPublication = new PublicationModel(req.body);
    await newPublication.save();
    return res.status(201).json(newPublication);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al crear la publicación" });
  }
};
0;
// Obtener todas las publicaciones activas
export const getPublications = async (req, res) => {
  try {
    const publications = await PublicationModel.find({ is_deleted: false }); // solo activas
    return res.status(200).json(publications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener las publicaciones" });
  }
};

// Obtener una publicación por ID
export const getPublicationById = async (req, res) => {
  try {
    const publication = await PublicationModel.findOne({
      _id: req.params.id,
      is_deleted: false,
    });
    if (!publication) {
      return res.status(404).json({ msg: "Publicación no encontrada" });
    }
    return res.status(200).json(publication);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener la publicación" });
  }
};

// Actualizar una publicación
export const updatePublication = async (req, res) => {
  try {
    const updatedPublication = await PublicationModel.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      { new: true }
    );
    if (!updatedPublication) {
      return res
        .status(404)
        .json({ msg: "Publicación no encontrada o eliminada" });
    }
    return res.status(200).json(updatedPublication);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al actualizar la publicación" });
  }
};

export const deletePublication = async (req, res) => {
  try {
    await PublicationModel.findByIdAndUpdate(
      req.params.id,
      { is_deleted: true },
      { new: true }
    );
    return res.status(200).json({ msg: "Publicación eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al eliminar la publicación" });
  }
};
