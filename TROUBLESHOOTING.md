# 🆘 Solución de Problemas - aportAR

## Problema: "Toqué algo en el localStorage y se rompió todo"

### ✅ Solución Rápida (10 segundos)

1. Presiona `F12` para abrir DevTools
2. Ve a la pestaña **Console**
3. Escribe: `localStorage.clear()`
4. Presiona Enter
5. Recarga la página con `F5`

**¡Listo!** Tu app debería funcionar nuevamente.

---

## 🔧 Soluciones Detalladas

### Opción 1: Limpiar TODO el localStorage

```javascript
localStorage.clear();
location.reload();
```

### Opción 2: Limpiar solo las Asistencias

```javascript
localStorage.removeItem("quarters");
location.reload();
```

### Opción 3: Ver qué tienes guardado

```javascript
// Ver todos los datos
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}
```

### Opción 4: Usar el Componente de Emergencia

Si tu aplicación aún puede cargar:

1. Abre `src/App.jsx` o `src/pages/Dashboard.jsx`
2. Agrega al inicio:
   ```jsx
   import StorageManager from "@/components/StorageManager";
   ```
3. Dentro del return, agrega:
   ```jsx
   <StorageManager />
   ```
4. Aparecerá un botón rojo "Emergencia" en la esquina inferior derecha
5. Click en el botón para acceder a herramientas de reset y backup

---

## 📦 Hacer Backup antes de resetear

```javascript
// Crear backup
const backup = {
  users: localStorage.getItem("users"),
  quarters: localStorage.getItem("quarters"),
  announcements: localStorage.getItem("announcements"),
  conversations: localStorage.getItem("conversations"),
  currentUser: localStorage.getItem("currentUser"),
};

// Guardar en archivo
const blob = new Blob([JSON.stringify(backup, null, 2)], {
  type: "application/json",
});
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "backup-aportAR.json";
a.click();
```

---

## 🔄 Restaurar desde Backup

```javascript
// Pega aquí el contenido de tu archivo backup-aportAR.json
const backup = {
  /* tu backup aquí */
};

// Restaurar
Object.keys(backup).forEach((key) => {
  if (backup[key]) {
    localStorage.setItem(key, backup[key]);
  }
});

location.reload();
```

---

## 🐛 Otros Problemas Comunes

### La página se queda en blanco

```javascript
// Limpiar cache y storage
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

### Error: "Cannot read property of undefined"

```javascript
// Resetear datos corruptos
localStorage.removeItem("quarters");
localStorage.removeItem("users");
location.reload();
```

### No puedo iniciar sesión

```javascript
// Resetear sesión
localStorage.removeItem("currentUser");
location.reload();
```

---

## 📱 Desde DevTools (Chrome/Edge)

1. `F12` → **Application**
2. Panel izquierdo: **Storage** → **Local Storage**
3. Click en tu dominio (ej: `localhost:3000`)
4. Click derecho → **Clear**
5. Recarga con `Ctrl + Shift + R`

---

## 💡 Prevención

### Antes de modificar el localStorage manualmente:

1. **Haz backup** (ver sección anterior)
2. **Usa la consola** para ver qué hay:
   ```javascript
   console.log(JSON.parse(localStorage.getItem("quarters")));
   ```
3. **Modifica con cuidado**:

   ```javascript
   // ✅ Correcto
   const data = JSON.parse(localStorage.getItem('quarters') || '[]');
   data.push({...});
   localStorage.setItem('quarters', JSON.stringify(data));

   // ❌ Incorrecto (puede romper todo)
   localStorage.setItem('quarters', 'algo que no es JSON válido');
   ```

---

## 🚨 En caso de emergencia extrema

Si nada de lo anterior funciona:

1. Cierra el navegador completamente
2. Abre el navegador en modo incógnito
3. Navega a tu app: `http://localhost:3000`
4. Debería funcionar (pero sin datos guardados)
5. Si funciona, vuelve a la ventana normal y limpia el localStorage

---

## 📞 ¿Necesitas ayuda?

- Lee el archivo `RESET_STORAGE.md` para más detalles
- Revisa la consola de DevTools (F12) para ver errores específicos
- Verifica que el servidor de desarrollo esté corriendo: `npm run dev`

---

**Fecha de última actualización:** Noviembre 2025
