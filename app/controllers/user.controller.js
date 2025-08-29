import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js"; 

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validaciones básicas
    if (!name) return res.status(400).json({ message: "El campo `name` es obligatorio" });
    if (!email) return res.status(400).json({ message: "El campo `email` es obligatorio" });
    if (!password) return res.status(400).json({ message: "El campo `password` es obligatorio" });

    // Sanitización
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "El email no es válido" });
    }

    // Validar contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo" 
      });
    }

    // Verificar si el usuario ya existe
    const userExist = await UserModel.findOne({ where: { email: cleanEmail } });
    if (userExist) {
      return res.status(400).json({ message: "Ya existe un usuario con este email" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await UserModel.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    // Respuesta sin exponer la contraseña
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hubo un error al crear el usuario" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: ["id", "name", "email", "createdAt"], // no se muestra la contra
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: TaskModel,       // incluimos las tareas asociadas
          as: "tasks",            
          attributes: ["id", "title", "description", "isComplete"] 
        }
      ]
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No hay usuarios registrados" });
    }

    return res.status(200).json(users);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hubo un error al obtener los usuarios" });
  }
};


export const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const user = await UserModel.findByPk(userId, {
      attributes: ["id", "name", "email", "createdAt"],
      include: [
        {
          model: TaskModel,      
          as: "tasks",
          attributes: ["id", "title", "description", "isComplete"]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hubo un error al buscar el usuario" });
  }
};


export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const userId = Number(id);
    if (!Number.isInteger(userId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    if (!name && !email && !password) {
      return res.status(400).json({ message: "No hay datos para actualizar" });
    }

    const user = await UserModel.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const updates = {};

    // name (opcional)
    if (typeof name === "string" && name.trim() !== "") {
      updates.name = name.trim();
    }

    // email (opcional)
    if (typeof email === "string") {
      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({ message: "El email no es válido" });
      }
      // solo chequear unicidad si realmente cambió
      if (cleanEmail !== user.email) {
        const existingEmail = await UserModel.findOne({ where: { email: cleanEmail } });
        if (existingEmail && existingEmail.id !== userId) {
          return res.status(400).json({ message: "Ya existe un usuario con ese email" });
        }
      }
      updates.email = cleanEmail;
    }

    // password (opcional)
    if (typeof password === "string") {
      if (password.trim().length === 0) {
        return res.status(400).json({ message: "La contraseña no puede estar vacía" });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
      }
      const hashed = await bcrypt.hash(password, 10);
      updates.password = hashed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No hay cambios válidos para actualizar" });
    }

    await user.update(updates);

    // devolver solo campos seguros
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hubo un problema al actualizar el usuario" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.params.id);

    if (user) {
      await user.destroy();
      return res.status(200).json({ message: "Usuario eliminado correctamente" });
    } else {
      return res.status(404).json({ message: "No se encontró el usuario a eliminar" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hubo un error al eliminar el usuario" });
  }
};