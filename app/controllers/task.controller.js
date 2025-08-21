import TaskModel from "../models/task.models.js";
import UserModel from "../models/user.models.js";

export const createTask = async (req, res) => {
  const { title, description, isComplete, userId } = req.body;

  try {
    if (!title || !description || !userId) {
      return res.status(400).json({ message: "Los campos 'title', 'description' y 'userId' son obligatorios" });
    }

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "No se encontró el usuario asociado" });
    }

    const taskExist = await TaskModel.findOne({ where: { title } });
    if (taskExist) {
      return res.status(400).json({ message: "Ya existe una tarea con ese título" });
    }

    // Crear la tarea asociada al usuario
    const task = await user.createTask({ title, description, isComplete });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hubo un error al crear la tarea" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.findAll({
      include: [{ model: UserModel, as: "author", attributes: ["id", "name", "email"] }]
    });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hubo un error al obtener las tareas" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await TaskModel.findByPk(req.params.id, {
      include: [{ model: UserModel, as: "author", attributes: ["id", "name", "email"] }]
    });

    if (task) {
      return res.status(200).json(task);
    } else {
      return res.status(404).json({ message: "No se encontró la tarea" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hubo un error al buscar la tarea" });
  }
};


export const updateTask = async (req, res) => {
  const { title, description, isComplete } = req.body;

  try {
    const { id } = req.params;

    const task = await modelTask.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (title && title !== task.title) {
      const titleExist = await modelTask.findOne({ where: { title } });
      if (titleExist) {
        return res.status(400).json({ message: "Ya existe una tarea con ese título" });
      }
    }

    await task.update({ title, description, isComplete });
    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hubo un error al actualizar la tarea" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await modelTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "No se encontró la tarea a eliminar" });
    }

    await task.destroy();
    return res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hubo un error al eliminar la tarea" });
  }
};

