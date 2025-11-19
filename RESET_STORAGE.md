# 🔧 Guía para Resetear el LocalStorage

Si tu aplicación se rompió por modificar el localStorage, aquí tienes varias formas de solucionarlo:

## Opción 1: Desde la Consola del Navegador (Más Rápido)

1. Abre las DevTools con `F12` o `Ctrl + Shift + I`
2. Ve a la pestaña **Console** (Consola)
3. Ejecuta este comando:

```javascript
localStorage.clear();
```

4. Recarga la página con `F5` o `Ctrl + R`

## Opción 2: Resetear solo las Asistencias

Si solo quieres limpiar las asistencias sin borrar usuarios ni sesiones:

```javascript
localStorage.removeItem("quarters");
```

## Opción 3: Desde DevTools (Chrome/Edge)

1. Abre DevTools (`F12`)
2. Ve a la pestaña **Application** (o **Aplicación**)
3. En el panel izquierdo, expande **Storage** → **Local Storage**
4. Click en tu dominio (ej: `http://localhost:3000`)
5. Click derecho → **Clear**

## Opción 4: Resetear solo datos específicos

```javascript
// Limpiar solo usuarios
localStorage.removeItem("users");

// Limpiar solo sesión actual
localStorage.removeItem("currentUser");

// Limpiar solo anuncios
localStorage.removeItem("announcements");

// Limpiar solo mensajes
localStorage.removeItem("conversations");
```

## Opción 5: Ver qué hay en el localStorage

Para ver qué datos tienes guardados:

```javascript
console.log("Usuarios:", JSON.parse(localStorage.getItem("users") || "[]"));
console.log(
  "Cuatrimestres:",
  JSON.parse(localStorage.getItem("quarters") || "[]")
);
console.log(
  "Usuario actual:",
  JSON.parse(localStorage.getItem("currentUser") || "null")
);
```

## Opción 6: Exportar antes de borrar (Backup)

```javascript
// Guardar backup de todos los datos
const backup = {
  users: localStorage.getItem("users"),
  quarters: localStorage.getItem("quarters"),
  announcements: localStorage.getItem("announcements"),
  conversations: localStorage.getItem("conversations"),
  currentUser: localStorage.getItem("currentUser"),
};

// Copiar al portapapeles
copy(JSON.stringify(backup, null, 2));

// Ahora puedes limpiar con seguridad
localStorage.clear();
```

## Opción 7: Restaurar desde backup

```javascript
// Pegar aquí tu backup (el objeto que copiaste antes)
const backup = {
  // ... tu backup aquí
};

// Restaurar
Object.keys(backup).forEach((key) => {
  if (backup[key]) {
    localStorage.setItem(key, backup[key]);
  }
});
```

## ⚠️ Nota Importante

Después de limpiar el localStorage:

- Tendrás que volver a iniciar sesión
- Se perderán todos los datos locales (usuarios de prueba, asistencias, etc.)
- La aplicación volverá a su estado inicial

## 🔄 Recarga Forzada

Si después de limpiar el localStorage sigues viendo problemas:

1. `Ctrl + Shift + R` (Chrome/Edge) - Recarga forzada
2. `Ctrl + F5` (Firefox) - Recarga sin caché
3. `Shift + F5` - Recarga completa
