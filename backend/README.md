# Backend API - aportAR

API REST completa para la plataforma aportAR del Instituto Politécnico de Formosa.

## 🚀 Tecnologías

- **Node.js** + **Express** - Servidor y framework web
- **MongoDB** + **Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas
- **express-validator** - Validación de datos
- **CORS** - Control de acceso entre dominios
- **Morgan** - Logging de peticiones HTTP

## 📦 Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/` con:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/aportar_db
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

### 3. Iniciar MongoDB

#### Opción A: MongoDB Local

```bash
mongod
```

#### Opción B: MongoDB Atlas (Cloud)

Usa la URL de conexión de tu cluster en `MONGO_URI`

### 4. Iniciar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📚 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint          | Descripción                      | Acceso  |
| ------ | ----------------- | -------------------------------- | ------- |
| POST   | `/register`       | Registrar usuario                | Público |
| POST   | `/login`          | Iniciar sesión                   | Público |
| POST   | `/logout`         | Cerrar sesión                    | Privado |
| GET    | `/me`             | Obtener usuario actual           | Privado |
| PUT    | `/updateprofile`  | Actualizar perfil                | Privado |
| PUT    | `/updatepassword` | Cambiar contraseña               | Privado |
| GET    | `/users`          | Listar usuarios                  | Admin   |
| GET    | `/users/filter`   | Filtrar usuarios por carrera/año | Admin   |

#### Ejemplo: Registro

```json
POST /api/auth/register
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "role": "estudiante",
  "career": "Software",
  "academicYear": "2"
}
```

#### Ejemplo: Login

```json
POST /api/auth/login
{
  "email": "juan@example.com",
  "password": "123456"
}
```

### 📅 Cuatrimestres (`/api/quarters`)

| Método | Endpoint             | Descripción             | Acceso     |
| ------ | -------------------- | ----------------------- | ---------- |
| POST   | `/`                  | Crear cuatrimestre      | Admin      |
| GET    | `/`                  | Listar cuatrimestres    | Admin      |
| GET    | `/:id`               | Obtener cuatrimestre    | Privado    |
| PUT    | `/:id`               | Actualizar cuatrimestre | Admin      |
| DELETE | `/:id`               | Eliminar cuatrimestre   | Admin      |
| PUT    | `/:id/attendance`    | Actualizar asistencia   | Admin      |
| GET    | `/my/quarters`       | Mis cuatrimestres       | Estudiante |
| GET    | `/:id/my/attendance` | Mi asistencia           | Estudiante |

#### Ejemplo: Crear Cuatrimestre

```json
POST /api/quarters
{
  "name": "Primer Cuatrimestre 2024",
  "career": "Software",
  "year": "2",
  "subjects": [
    {
      "name": "Programación II",
      "totalClasses": 60
    },
    {
      "name": "Base de Datos",
      "totalClasses": 50
    }
  ]
}
```

#### Ejemplo: Actualizar Asistencia

```json
PUT /api/quarters/:id/attendance
{
  "userId": "673b5c8f9d8e1234567890ab",
  "subjectId": "673b5c8f9d8e1234567890cd",
  "attended": 45
}
```

### 📝 Publicaciones (`/api/posts`)

| Método | Endpoint                   | Descripción                        | Acceso  |
| ------ | -------------------------- | ---------------------------------- | ------- |
| POST   | `/`                        | Crear publicación                  | Privado |
| GET    | `/`                        | Listar publicaciones (con filtros) | Privado |
| GET    | `/:id`                     | Obtener publicación                | Privado |
| PUT    | `/:id`                     | Actualizar publicación             | Privado |
| DELETE | `/:id`                     | Eliminar publicación               | Privado |
| POST   | `/:id/comments`            | Agregar comentario                 | Privado |
| DELETE | `/:id/comments/:commentId` | Eliminar comentario                | Privado |
| POST   | `/:id/like`                | Dar/quitar like                    | Privado |
| POST   | `/:id/vote`                | Votar en encuesta                  | Privado |

#### Ejemplo: Crear Publicación

```json
POST /api/posts
{
  "type": "consulta",
  "title": "Duda sobre React Hooks",
  "content": "¿Cuál es la diferencia entre useState y useEffect?",
  "career": "Software",
  "year": "2",
  "category": "Programación"
}
```

#### Ejemplo: Filtrar Publicaciones

```
GET /api/posts?type=consulta&career=Software&year=2&search=react
```

### 💬 Conversaciones (`/api/conversations`)

| Método | Endpoint        | Descripción           | Acceso  |
| ------ | --------------- | --------------------- | ------- |
| GET    | `/`             | Listar conversaciones | Privado |
| GET    | `/users`        | Usuarios disponibles  | Privado |
| GET    | `/unread-count` | Mensajes no leídos    | Privado |
| GET    | `/:id`          | Obtener conversación  | Privado |
| POST   | `/`             | Crear conversación    | Privado |
| POST   | `/:id/messages` | Enviar mensaje        | Privado |
| DELETE | `/:id`          | Eliminar conversación | Privado |

#### Ejemplo: Crear Conversación

```json
POST /api/conversations
{
  "participantId": "673b5c8f9d8e1234567890ab"
}
```

#### Ejemplo: Enviar Mensaje

```json
POST /api/conversations/:id/messages
{
  "content": "Hola, ¿cómo estás?"
}
```

### 🔔 Notificaciones (`/api/notifications`)

| Método | Endpoint        | Descripción              | Acceso  |
| ------ | --------------- | ------------------------ | ------- |
| GET    | `/`             | Listar notificaciones    | Privado |
| GET    | `/unread-count` | Contar no leídas         | Privado |
| PUT    | `/read-all`     | Marcar todas como leídas | Privado |
| PUT    | `/:id/read`     | Marcar como leída        | Privado |
| DELETE | `/:id`          | Eliminar notificación    | Privado |

## 🔒 Autenticación

La API usa **JWT (JSON Web Tokens)** almacenados en **cookies httpOnly**.

### Headers requeridos

```
Authorization: Bearer <token>
```

O la cookie se enviará automáticamente.

### Respuesta de autenticación exitosa

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673b5c8f9d8e1234567890ab",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "estudiante",
    "career": "Software",
    "academicYear": "2"
  }
}
```

## 🎭 Roles de Usuario

- **estudiante** - Puede ver sus asistencias, publicar, comentar, chatear
- **admin** - Acceso completo, puede gestionar cuatrimestres y asistencias

## ⚠️ Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "error": "Mensaje de error descriptivo"
}
```

### Códigos de estado HTTP

- `200` - Éxito
- `201` - Recurso creado
- `400` - Error de validación
- `401` - No autenticado
- `403` - No autorizado (sin permisos)
- `404` - No encontrado
- `500` - Error del servidor

## 🧪 Testing

### Usando cURL

```bash
# Registrar usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Usando Postman o Thunder Client

Importa la colección de endpoints disponible en `docs/postman-collection.json`

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── db.js              # Configuración de MongoDB
├── controllers/
│   ├── authController.js  # Lógica de autenticación
│   ├── quarterController.js
│   ├── postController.js
│   ├── conversationController.js
│   └── notificationController.js
├── middlewares/
│   ├── auth.js            # Protección de rutas
│   └── validator.js       # Validación de datos
├── models/
│   ├── User.js
│   ├── Quarter.js
│   ├── Post.js
│   ├── Conversation.js
│   └── Notification.js
├── routes/
│   ├── authRoutes.js
│   ├── quarterRoutes.js
│   ├── postRoutes.js
│   ├── conversationRoutes.js
│   └── notificationRoutes.js
├── utils/
│   ├── jwt.js             # Utilidades de JWT
│   └── errorHandler.js    # Manejo de errores
├── .env                   # Variables de entorno
├── .gitignore
├── package.json
├── server.js              # Archivo principal
└── README.md
```

## 🚀 Despliegue en Producción

### Variables de entorno para producción

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/aportar_db
JWT_SECRET=clave_super_segura_aleatoria_de_produccion
JWT_EXPIRE=30d
CLIENT_URL=https://tu-dominio.com
```

### Recomendaciones

- Usa MongoDB Atlas para la base de datos
- Despliega en Render, Railway, o Heroku
- Habilita HTTPS en producción
- Configura rate limiting para prevenir ataques
- Usa variables de entorno seguras

## 📞 Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.

---

**Desarrollado para el Instituto Politécnico de Formosa** 🎓
