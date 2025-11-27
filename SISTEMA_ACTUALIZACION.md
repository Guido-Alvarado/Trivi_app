# Sistema de Actualización Automática al Reabrir la App

## 📋 Descripción

Se ha implementado un sistema que detecta cuando el usuario cierra y vuelve a abrir la aplicación, actualizando automáticamente los datos desde Firebase solo en ese momento.

## 🔄 Comportamiento

### ✅ Actualización Automática (desde Firebase)
- **Primera vez que abre la app** en una nueva sesión
- **Después de cerrar la pestaña/navegador** y volver a abrir
- **Después de refrescar la página** (F5)

### 💾 Uso de Caché (sin actualizar)
- **Navegando entre rutas** dentro de la app
- **Mientras la pestaña permanece abierta**
- **Volviendo a una vista** que ya visitó en la misma sesión

### 🔧 Actualización Manual
- **Botón "Actualizar"** siempre disponible para refrescar cuando el usuario quiera

## 🛠️ Implementación Técnica

### SessionStorage vs LocalStorage

```javascript
// LocalStorage: Persiste incluso después de cerrar el navegador
localStorage.setItem("carrerasCache", data); // ✅ Para guardar datos

// SessionStorage: Se borra al cerrar la pestaña
sessionStorage.setItem("carrerasLoaded", "true"); // ✅ Para detectar sesión activa
```

### Lógica de Detección

```javascript
// 1. Verificar si es una nueva sesión
const isNewSession = !sessionStorage.getItem("carrerasLoaded");

if (isNewSession) {
  // 2. Marcar que ya cargamos en esta sesión
  sessionStorage.setItem("carrerasLoaded", "true");
  
  // 3. Actualizar desde Firebase
  loadCarrerasFromFirebase();
} else if (cachedData && cachedTime) {
  // 4. Usar datos del caché (sesión activa)
  setCarreras(JSON.parse(cachedData));
  setLastUpdate(Number(cachedTime));
} else {
  // 5. No hay caché, cargar desde Firebase
  loadCarrerasFromFirebase();
}
```

## 📍 Archivos Modificados

### 1. **VistaCarreras.jsx**
- **SessionKey:** `"carrerasLoaded"`
- **Actualiza:** Lista de carreras
- **Cache:** `carrerasCache` + `carrerasCacheTime`

### 2. **VistaMateriasCandidatas.jsx**
- **SessionKey:** `"materiasLoaded_{nombreCarrera}"`
- **Actualiza:** Materias candidatas por carrera
- **Cache:** `materiasCandidatasCache_{nombreCarrera}` + tiempo

### 3. **VistaBD.jsx**
- **SessionKey:** `"preguntasLoaded_{nombreCarrera}_{materia}"`
- **Actualiza:** Preguntas por materia
- **Cache:** `preguntasCache_{nombreCarrera}_{materia}` + tiempo

## 🎯 Casos de Uso

### Escenario 1: Usuario abre la app por primera vez hoy
```
1. Abre la app → sessionStorage vacío
2. isNewSession = true
3. Carga desde Firebase ✅
4. Guarda en sessionStorage: "carrerasLoaded" = "true"
5. Navega a materias → usa caché 💾
6. Vuelve a carreras → usa caché 💾
```

### Escenario 2: Usuario cierra y vuelve a abrir
```
1. Cierra la pestaña/navegador
2. sessionStorage se borra automáticamente 🗑️
3. Vuelve a abrir la app
4. isNewSession = true (sessionStorage vacío)
5. Carga desde Firebase ✅
```

### Escenario 3: Usuario navega dentro de la app
```
1. Está en Carreras (ya cargó desde Firebase)
2. Va a Materias → usa caché 💾
3. Va a Preguntas → usa caché 💾
4. Vuelve a Carreras → usa caché 💾
5. NO actualiza desde Firebase (sesión activa)
```

### Escenario 4: Usuario quiere actualizar manualmente
```
1. Está navegando en la app
2. Click en botón "Actualizar" 🔄
3. Carga desde Firebase ✅
4. Actualiza el caché
5. Actualiza el timestamp
```

## ⚡ Ventajas

✅ **Datos frescos al abrir:** Siempre tiene datos actualizados al iniciar  
✅ **Navegación rápida:** No recarga innecesariamente entre rutas  
✅ **Ahorro de lecturas:** Reduce consultas a Firebase  
✅ **Control manual:** El usuario puede actualizar cuando quiera  
✅ **Experiencia fluida:** No hay retrasos al navegar  

## 🔍 Cómo Probar

### Test 1: Nueva Sesión
1. Abre la app en una pestaña nueva
2. Observa que carga desde Firebase (spinner)
3. Navega a otra vista
4. Vuelve a la vista anterior
5. **Resultado esperado:** Usa caché (carga instantánea)

### Test 2: Cerrar y Reabrir
1. Cierra completamente el navegador
2. Vuelve a abrir la app
3. **Resultado esperado:** Carga desde Firebase

### Test 3: Refrescar Página
1. Presiona F5 en cualquier vista
2. **Resultado esperado:** Carga desde Firebase

### Test 4: Actualización Manual
1. Navega normalmente
2. Click en botón "Actualizar"
3. **Resultado esperado:** Carga desde Firebase

## 📊 Diferencias Clave

| Acción | Antes | Ahora |
|--------|-------|-------|
| Abrir app | Usa caché si existe | Actualiza desde Firebase ✅ |
| Navegar entre rutas | Usa caché | Usa caché (igual) |
| Cerrar y reabrir | Usa caché | Actualiza desde Firebase ✅ |
| Refrescar (F5) | Usa caché | Actualiza desde Firebase ✅ |
| Botón actualizar | Actualiza | Actualiza (igual) |

## 🎓 Conceptos Importantes

### SessionStorage
- Se borra al cerrar la pestaña
- Perfecto para detectar nuevas sesiones
- No persiste entre sesiones del navegador

### LocalStorage
- Persiste indefinidamente
- Perfecto para caché de datos
- Se mantiene entre sesiones

### Combinación Perfecta
```javascript
// LocalStorage: Guardar datos (persiste)
localStorage.setItem("carrerasCache", JSON.stringify(carreras));

// SessionStorage: Marcar sesión activa (temporal)
sessionStorage.setItem("carrerasLoaded", "true");

// Al cerrar: sessionStorage se borra, localStorage permanece
// Al reabrir: sessionStorage vacío → actualizar desde Firebase
//             localStorage con datos → mostrar mientras carga
```
