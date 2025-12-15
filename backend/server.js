import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { errorHandler } from "./utils/errorHandler.js";

// Importar rutas
import authRoutes from "./routes/authRoutes.js";
import quarterRoutes from "./routes/quarterRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

// Inicializar Express
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Morgan (logs) solo en desarrollo
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/quarters", quarterRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/notifications", notificationRoutes);

// Ruta de prueba
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "API de aportAR funcionando correctamente",
    version: "1.0.0",
  });
});

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🚀 Servidor aportAR iniciado        ║
  ║   📡 Puerto: ${PORT}                       ║
  ║   🌍 Entorno: ${process.env.NODE_ENV || "development"}         ║
  ║   ✅ API disponible en:               ║
  ║      http://localhost:${PORT}/api        ║
  ╚════════════════════════════════════════╝
  `);
});

// Manejo de rechazos no controlados
process.on("unhandledRejection", (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
