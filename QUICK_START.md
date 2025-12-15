# 🚀 Inicio Rápido - aportAR Backend

## ⚡ Pasos para iniciar (5 minutos)

### 1. Instalar MongoDB

**Opción más rápida: MongoDB Atlas (Cloud - Gratis)**

1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Crea cuenta gratuita
3. Crea un cluster (M0 - Free)
4. En "Connect" → "Connect your application" → copia la URL
5. Pega la URL en `backend/.env` → `MONGO_URI`

**O usa MongoDB local si ya lo tienes instalado**

### 2. Configurar Variables

Edita `backend/.env` (ya está creado):

```env
MONGO_URI=mongodb://localhost:27017/aportar_db
# O tu URL de Atlas: mongodb+srv://user:pass@cluster.mongodb.net/aportar_db
```

### 3. Instalar e Iniciar

```bash
# Desde la carpeta backend/
cd backend

# Ya instalado ✅ (hecho automáticamente)
# npm install

# Crear datos de prueba
npm run seed

# Iniciar servidor
npm run dev
```

### 4. Verificar que funciona

Abre en tu navegador: http://localhost:5000/api

Deberías ver:

```json
{
  "success": true,
  "message": "API de aportAR funcionando correctamente",
  "version": "1.0.0"
}
```

## 🎯 Probar con usuarios de prueba

Después de ejecutar `npm run seed` tendrás:

| Email                  | Password | Rol        |
| ---------------------- | -------- | ---------- |
| admin@politecnico.edu  | 123456   | admin      |
| juan@politecnico.edu   | 123456   | estudiante |
| maria@politecnico.edu  | 123456   | estudiante |
| carlos@politecnico.edu | 123456   | estudiante |

## 📡 Probar Login

### Con cURL:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@politecnico.edu\",\"password\":\"123456\"}"
```

### Con navegador (Extensión Thunder Client o similar):

```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "admin@politecnico.edu",
  "password": "123456"
}
```

## ✅ Checklist

- [ ] MongoDB instalado o Atlas configurado
- [ ] `backend/.env` configurado con MONGO_URI
- [ ] Ejecutar `npm run seed` (solo la primera vez)
- [ ] Ejecutar `npm run dev`
- [ ] Verificar http://localhost:5000/api
- [ ] Probar login con usuarios de prueba

## 🐛 Solución de Problemas

### Error: "MongoServerError: Authentication failed"

→ Revisa usuario/password en MONGO_URI (Atlas)
→ Whitelist tu IP en MongoDB Atlas

### Error: "connect ECONNREFUSED 127.0.0.1:27017"

→ MongoDB local no está corriendo
→ Ejecuta `mongod` o usa Atlas

### Error: "Cannot find module"

→ Ejecuta `npm install` en carpeta backend/

### Puerto 5000 ocupado

→ Cambia PORT en `.env` a otro puerto (ej: 5001)

## 📚 Siguiente Paso

Lee **`MIGRATION_GUIDE.md`** para conectar el frontend con este backend.

## 🎓 URLs Útiles

- **API Base**: http://localhost:5000/api
- **Documentación**: Ver `backend/README.md`
- **MongoDB Compass**: mongodb://localhost:27017 (para ver la DB)

---

**¿Todo funcionando?** 🎉 Continúa con la migración del frontend!
