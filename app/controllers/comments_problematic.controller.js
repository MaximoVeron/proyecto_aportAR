import { CommentProblematicModel } from "../models/comments_problematic.model.js";

export const createCommentProblematic = async (req, res) => {
  try {
    const newComment = new CommentProblematicModel(req.body);
    await newComment.save();
    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al crear el comentario" });
  }
};

export const getCommentsProblematic = async (req, res) => {
  try {
    const comments = await CommentProblematicModel.find();
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener los comentarios" });
  }
};

export const getCommentProblematicById = async (req, res) => {
  try {
    const comment = await CommentProblematicModel.findOne({
      _id: req.params.id,
      is_deleted: false,
    });
    return res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el comentario" });
  }
};

export const updateCommentProblematic = async (req, res) => {
  try {
    const updatedComment = await CommentProblematicModel.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al actualizar el comentario" });
  }
};

export const deleteCommentProblematic = async (req, res) => {
  try {
    await CommentProblematicModel.findByIdAndUpdate(req.params.id, {
      is_deleted: true,
    });
    return res.status(200).json({ msg: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al eliminar el comentario" });
  }
};
