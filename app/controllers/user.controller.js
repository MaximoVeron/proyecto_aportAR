import { UserModel } from "../models/user.model.js";

export const createUser = async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json("error al crear los usuarios");
  }
};

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
    const user = await UserModel.findById({
      _id: req.params.id,
      is_deleted: false,
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "error al obtener el usuario" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(updateUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "error al actualizar el usuario" });
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
