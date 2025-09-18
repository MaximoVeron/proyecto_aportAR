import { CommentsModel } from "../models/comments.model.js";

export const createComment = async (req, res) => {
  try {
    const newComment = new CommentsModel(req.body);
    await newComment.save();
    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al crear el comentario" });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await CommentsModel.find();
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener los comentarios" });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const comment = await CommentsModel.findOne({
      _id: req.params.id,
      is_deleted: false,
    });
    return res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el comentario" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const updatedComment = await CommentsModel.findOneAndUpdate(
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

export const deleteComment = async (req, res) => {
  try {
    await CommentsModel.findByIdAndUpdate(req.params.id, {
      is_deleted: true,
    });
    return res.status(200).json({ msg: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al eliminar el comentario" });
  }
};
