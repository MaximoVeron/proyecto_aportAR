import dotenv from "dotenv";
import express from "express";
import userRoutes from "./src/routes/user.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import { initDB } from "./src/config/database.js";
import profileRoutes from "./src/routes/profile.routes.js";
import rolesRoutes from "./src/routes/role.routes.js";
import userRoleRoutes from "./src/routes/userRole.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/role", rolesRoutes);
app.use("/api/user-role", userRoleRoutes);

const PORT = process.env.PORT || 3000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
  });
});


