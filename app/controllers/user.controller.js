import { UserModel } from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const Users = await UserModel.find({ is_deleted: false });
    return res.status(200).json(Users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "error al obtener los usuarios" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      _id: req.params.id,
      is_deleted: false,
    });
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "error al obtener el usuario" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await UserModel.findByIdAndUpdate(req.params.id, {
      is_deleted: true,
    });
    return res.status(200).json({ msg: "usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "error al eliminar el usuario" });
  }
};
