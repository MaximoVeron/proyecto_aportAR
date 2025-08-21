import { RoleModel } from "../models/role.model.js";
import UserModel from "../models/user.models.js";


export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "El nombre del rol es obligatorio" });
    }

    const role = await RoleModel.create({ name, description });
    return res.status(201).json(role);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear el rol" });
  }
};


export const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.findAll({
      include: {
        model: UserModel,
        as: "users",
        attributes: ["id", "username", "email"],
        through: { attributes: [] } 
      },
    });
    return res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los roles" });
  }
};
