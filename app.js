import "dotenv/config";
import express from "express";
import router from "./app/routes/index.js";
import { initDB } from "./app/config/database.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT;
app.use("/api", router);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
  });
});
