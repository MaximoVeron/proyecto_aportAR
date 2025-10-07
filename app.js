import "dotenv/config";
import express from "express";
import router from "./app/routes/index.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initDB } from "./app/config/database.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const PORT = process.env.PORT;
app.use("/api", router);

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`servidor corriendo en http://localhost:${PORT}👍`);
    });
  })
  .catch((error) => {
    console.error("Error al iniciar la base de datos", error);
    process.exit(1);
  });
