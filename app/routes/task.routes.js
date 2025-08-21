import express from "express";

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controllers.js";

const taskRoutes = express.Router();

taskRoutes.post("/", createTask);
taskRoutes.get("/", getAllTasks);
taskRoutes.get("/:id", getTaskById);
taskRoutes.put("/:id", updateTask);
taskRoutes.delete("/:id", deleteTask);

export default taskRoutes;
