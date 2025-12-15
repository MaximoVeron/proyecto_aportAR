# 🔄 Guía de Migración del Frontend

Esta guía te ayudará a migrar el frontend de LocalStorage al backend con API REST.

## 📋 Pasos de Migración

### 1. Instalar Dependencias Adicionales

```bash
npm install axios
```

### 2. Crear Servicio de API

Crea `src/services/api.js`:

```javascript
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Para enviar cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
```

### 3. Migrar AuthContext

Reemplaza `src/contexts/AuthContext.jsx`:

```javascript
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "@/components/ui/use-toast";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await api.get("/auth/me");
        setCurrentUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.token);
      setCurrentUser(response.user);
      toast({
        title: "¡Bienvenido!",
        description: `Hola ${response.user.name}`,
      });
      return response.user;
    } catch (error) {
      toast({
        title: "Error",
        description: error.error || "Credenciales inválidas",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      localStorage.setItem("token", response.token);
      setCurrentUser(response.user);
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada",
      });
      return response.user;
    } catch (error) {
      toast({
        title: "Error",
        description: error.error || "No se pudo registrar",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      setCurrentUser(null);
      toast({
        title: "Sesión cerrada",
        description: "Hasta pronto",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.put("/auth/updateprofile", data);
      setCurrentUser(response.data);
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se guardaron correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.error || "No se pudo actualizar",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### 4. Migrar AttendanceContext

Actualiza `src/contexts/AttendanceContext.jsx`:

```javascript
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

const AttendanceContext = createContext();

export function useAttendance() {
  return useContext(AttendanceContext);
}

export function AttendanceProvider({ children }) {
  const { currentUser } = useAuth();
  const [quarters, setQuarters] = useState([]);

  useEffect(() => {
    if (currentUser) {
      loadQuarters();
    }
  }, [currentUser]);

  const loadQuarters = async () => {
    try {
      const endpoint =
        currentUser?.role === "admin" ? "/quarters" : "/quarters/my/quarters";
      const response = await api.get(endpoint);
      setQuarters(response.data);
    } catch (error) {
      console.error("Error al cargar cuatrimestres:", error);
    }
  };

  const createQuarter = async (quarterData) => {
    try {
      const response = await api.post("/quarters", quarterData);
      setQuarters([...quarters, response.data]);
      toast({
        title: "¡Cuatrimestre creado!",
        description: `${quarterData.name} creado exitosamente`,
      });
      return response.data;
    } catch (error) {
      toast({
        title: "Error",
        description: error.error || "No se pudo crear el cuatrimestre",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStudentAttendance = async (
    quarterId,
    userId,
    subjectId,
    attended
  ) => {
    try {
      const response = await api.put(`/quarters/${quarterId}/attendance`, {
        userId,
        subjectId,
        attended,
      });

      // Actualizar estado local
      setQuarters(
        quarters.map((q) => (q.id === quarterId ? response.data : q))
      );

      return response.data;
    } catch (error) {
      toast({
        title: "Error",
        description: error.error || "No se pudo actualizar la asistencia",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteQuarter = async (quarterId) => {
    try {
      await api.delete(`/quarters/${quarterId}`);
      setQuarters(quarters.filter((q) => q.id !== quarterId));
      toast({
        title: "Cuatrimestre eliminado",
        description: "El cuatrimestre fue eliminado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.error || "No se pudo eliminar",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getStudentQuarters = () => {
    return quarters;
  };

  const getStudentAttendanceInQuarter = async (quarterId) => {
    try {
      const response = await api.get(`/quarters/${quarterId}/my/attendance`);
      return response;
    } catch (error) {
      console.error("Error al obtener asistencias:", error);
      return null;
    }
  };

  const value = {
    quarters,
    createQuarter,
    updateStudentAttendance,
    getStudentQuarters,
    getStudentAttendanceInQuarter,
    deleteQuarter,
    loadQuarters,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
}
```

### 5. Crear Variables de Entorno

Crea `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Migrar Otros Contextos

Sigue el mismo patrón para:

- `AnnouncementsContext` → usar `/api/posts`
- `MessagingContext` → usar `/api/conversations`
- `NotificationContext` → usar `/api/notifications`

## 🔑 Cambios Clave

### Antes (LocalStorage)

```javascript
const users = JSON.parse(localStorage.getItem("users") || "[]");
users.push(newUser);
localStorage.setItem("users", JSON.stringify(users));
```

### Después (API)

```javascript
const response = await api.post("/auth/register", newUser);
setUsers([...users, response.data]);
```

## 📝 Checklist de Migración

- [ ] Instalar axios
- [ ] Crear servicio API
- [ ] Migrar AuthContext
- [ ] Migrar AttendanceContext
- [ ] Migrar AnnouncementsContext
- [ ] Migrar MessagingContext
- [ ] Migrar NotificationContext
- [ ] Actualizar componentes que usan los contextos
- [ ] Remover llamadas a localStorage (excepto token)
- [ ] Probar todas las funcionalidades
- [ ] Manejar estados de carga
- [ ] Manejar errores de red

## 🚀 Iniciar Desarrollo

1. **Backend:**

   ```bash
   cd backend
   npm run seed    # Crear datos de prueba
   npm run dev     # Iniciar servidor
   ```

2. **Frontend:**
   ```bash
   npm run dev     # Desde la raíz del proyecto
   ```

## 🔍 Debugging

### Ver requests en consola:

```javascript
api.interceptors.request.use((config) => {
  console.log(
    "API Request:",
    config.method.toUpperCase(),
    config.url,
    config.data
  );
  return config;
});
```

### Ver responses:

```javascript
api.interceptors.response.use((response) => {
  console.log("API Response:", response);
  return response;
});
```

## ⚠️ Consideraciones

1. **Manejo de errores**: Siempre usa try-catch
2. **Loading states**: Muestra spinners mientras cargan datos
3. **Token**: Se guarda en localStorage y se envía en headers
4. **CORS**: Ya está configurado en el backend
5. **Cookies**: El backend envía cookies httpOnly automáticamente

---

¿Necesitas ayuda con alguna parte específica de la migración? Revisa el README del backend para más detalles sobre los endpoints disponibles.
