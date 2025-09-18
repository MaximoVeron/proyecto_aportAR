import "dotenv/config";
import express from "express";
import { initDB } from "./app/config/database.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
  });
});
