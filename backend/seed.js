import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Quarter from "./models/Quarter.js";
import Post from "./models/Post.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Limpiar base de datos
    await User.deleteMany();
    await Quarter.deleteMany();
    await Post.deleteMany();
    console.log("🗑️  Base de datos limpiada");

    // Crear usuarios de ejemplo
    const admin = await User.create({
      name: "Admin Sistema",
      email: "admin@politecnico.edu",
      password: "123456",
      role: "admin",
    });

    const estudiante1 = await User.create({
      name: "Juan Pérez",
      email: "juan@politecnico.edu",
      password: "123456",
      role: "estudiante",
      career: "Software",
      academicYear: "2",
    });

    const estudiante2 = await User.create({
      name: "María González",
      email: "maria@politecnico.edu",
      password: "123456",
      role: "estudiante",
      career: "Software",
      academicYear: "2",
    });

    const estudiante3 = await User.create({
      name: "Carlos Rodríguez",
      email: "carlos@politecnico.edu",
      password: "123456",
      role: "estudiante",
      career: "Telecomunicaciones",
      academicYear: "1",
    });

    console.log("👥 Usuarios creados");

    // Crear cuatrimestre de ejemplo
    const quarter = await Quarter.create({
      name: "Primer Cuatrimestre 2024",
      career: "Software",
      year: "2",
      subjects: [
        { name: "Programación II", totalClasses: 60 },
        { name: "Base de Datos", totalClasses: 50 },
        { name: "Desarrollo Web", totalClasses: 55 },
      ],
      createdBy: admin._id,
      attendances: [
        { userId: estudiante1._id, subjectId: "1", attended: 45 },
        { userId: estudiante1._id, subjectId: "2", attended: 40 },
        { userId: estudiante1._id, subjectId: "3", attended: 50 },
        { userId: estudiante2._id, subjectId: "1", attended: 55 },
        { userId: estudiante2._id, subjectId: "2", attended: 48 },
        { userId: estudiante2._id, subjectId: "3", attended: 52 },
      ],
    });

    console.log("📅 Cuatrimestre creado");

    // Crear publicaciones de ejemplo
    await Post.create({
      type: "consulta",
      title: "¿Cómo implementar autenticación JWT?",
      content: "Necesito ayuda para implementar JWT en mi proyecto de Node.js",
      author: estudiante1._id,
      career: "Software",
      year: "2",
      category: "Programación",
    });

    await Post.create({
      type: "proyecto",
      title: "Sistema de gestión escolar",
      content:
        "Proyecto final de desarrollo web - Sistema completo con React y Node",
      author: estudiante2._id,
      career: "Software",
      year: "2",
      category: "Proyectos",
      status: "en progreso",
    });

    await Post.create({
      type: "noticia",
      title: "Nueva biblioteca disponible en el campus",
      content: "A partir del lunes estará disponible la nueva sala de lectura",
      author: admin._id,
      career: "Todas",
      year: "Todos",
      category: "Noticias",
      isPinned: true,
    });

    console.log("📝 Publicaciones creadas");

    console.log(`
╔════════════════════════════════════════════════════╗
║  ✅ Base de datos inicializada correctamente      ║
║                                                    ║
║  👤 Usuarios creados:                              ║
║     • Admin: admin@politecnico.edu (123456)        ║
║     • Juan: juan@politecnico.edu (123456)          ║
║     • María: maria@politecnico.edu (123456)        ║
║     • Carlos: carlos@politecnico.edu (123456)      ║
║                                                    ║
║  📊 Datos de prueba:                               ║
║     • 1 cuatrimestre                               ║
║     • 3 materias                                   ║
║     • 3 publicaciones                              ║
║                                                    ║
║  🚀 Puedes iniciar el servidor ahora:              ║
║     npm run dev                                    ║
╚════════════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al inicializar datos:", error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());
