import { UserRoleModel } from "../models/user_role.model.js";
import UserModel from "../models/user.models.js";
import { RoleModel } from "../models/role.model.js";


export const assignRoleToUser = async (req, res) => {
  const { userId, roleId } = req.body;

  try {
    // Verificar que existan el usuario y el rol
    const user = await UserModel.findByPk(userId);
    const role = await RoleModel.findByPk(roleId);

    if (!user || !role) {
      return res.status(404).json({ message: "Usuario o rol no encontrado" });
    }

    // Crea la relación
    const userRole = await UserRoleModel.create({
      user_id: userId,
      role_id: roleId,
    });

    return res.status(201).json(userRole);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al asignar rol al usuario" });
  }
};

export const getAllUserRoles = async (req, res) => {
  try {
    const userRoles = await UserRoleModel.findAll({
      include: [
        { model: UserModel, as: "user", attributes: ["id", "name", "email"] },
        { model: RoleModel, as: "role", attributes: ["id", "name"] },
      ],
    });

    return res.status(200).json(userRoles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener relaciones usuario-rol" });
  }
};
