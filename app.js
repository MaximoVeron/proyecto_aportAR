import dotenv from "dotenv";
import express from "express";
import userRoutes from "./app/routes/user.routes.js";
import taskRoutes from "./app/routes/task.routes.js";
import profileRoutes from "./app/routes/profile.routes.js";
import rolesRoutes from "./app/routes/role.routes.js";
import userRoleRoutes from "./app/routes/userRole.routes.js";
import { initDB } from "./app/config/database.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/role", rolesRoutes);
app.use("/api/user-role", userRoleRoutes);

const PORT = process.env.PORT;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
  });
});


