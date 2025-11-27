# 🔐 Configurar Variables de Entorno en GitHub

Tu aplicación usa Firebase, por lo que necesitas configurar las credenciales como **Secrets** en GitHub para que el deploy funcione correctamente.

## 📝 Paso a Paso

### 1. Obtener tus credenciales de Firebase

Si aún no las tienes, ve a tu proyecto de Firebase:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Configuración del proyecto** (ícono de engranaje)
4. En la sección **Tus apps**, busca tu app web
5. Copia las credenciales que se muestran

Deberías ver algo como:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto.firebaseio.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

### 2. Agregar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Secrets and variables** → **Actions**
4. Haz clic en **New repository secret**

### 3. Crear los siguientes Secrets

Para cada uno de estos, haz clic en **New repository secret**, ingresa el nombre y el valor, y haz clic en **Add secret**:

#### Firebase Config 1 (Principal)

| Nombre del Secret | Valor de ejemplo |
|-------------------|------------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyAbc123...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `tu-proyecto.firebaseapp.com` |
| `VITE_FIREBASE_DATABASE_URL` | `https://tu-proyecto.firebaseio.com` |
| `VITE_FIREBASE_PROJECT_ID` | `tu-proyecto` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `tu-proyecto.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:abc123` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` |

#### Firebase Config 2 (Si usas una segunda configuración)

Si tu aplicación usa una segunda configuración de Firebase (revisa tu archivo `firebaseConfig.js`), también agrega estos:

| Nombre del Secret | Valor de ejemplo |
|-------------------|------------------|
| `VITE_FIREBASE_API_KEY_2` | `AIzaSyAbc123...` |
| `VITE_FIREBASE_AUTH_DOMAIN_2` | `tu-proyecto-2.firebaseapp.com` |
| `VITE_FIREBASE_DATABASE_URL_2` | `https://tu-proyecto-2.firebaseio.com` |
| `VITE_FIREBASE_PROJECT_ID_2` | `tu-proyecto-2` |
| `VITE_FIREBASE_STORAGE_BUCKET_2` | `tu-proyecto-2.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID_2` | `987654321` |
| `VITE_FIREBASE_APP_ID_2` | `1:987654321:web:xyz789` |
| `VITE_FIREBASE_MEASUREMENT_ID_2` | `G-YYYYYYYYYY` |

### 4. Verificar que los Secrets estén configurados

Una vez que hayas agregado todos los secrets:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Deberías ver todos los secrets listados (los valores estarán ocultos)
3. Si falta alguno, agrégalo

## ✅ Verificar el Deploy

Después de configurar los secrets:

1. Haz un push a tu repositorio:
   ```bash
   git add .
   git commit -m "Configure Firebase secrets"
   git push
   ```

2. Ve a la pestaña **Actions** en GitHub
3. Verifica que el workflow se ejecute correctamente
4. Si hay errores, revisa los logs para ver qué secret falta

## 🔒 Seguridad

- **NUNCA** subas tu archivo `.env` a GitHub
- Los secrets están encriptados y solo son accesibles durante el build
- No se muestran en los logs de GitHub Actions
- Solo los colaboradores con permisos pueden verlos/editarlos

## 🐛 Solución de Problemas

### Error: "Firebase is not configured"

**Causa:** Faltan secrets o están mal configurados.

**Solución:**
1. Verifica que todos los secrets estén agregados en GitHub
2. Asegúrate de que los nombres sean exactamente como se muestran arriba (incluyendo mayúsculas)
3. Verifica que los valores sean correctos

### El workflow falla en el paso "Build"

**Causa:** Algún secret tiene un valor incorrecto.

**Solución:**
1. Ve a los logs del workflow en la pestaña Actions
2. Busca el error específico
3. Verifica el secret correspondiente en Settings → Secrets

### ¿Cómo editar un secret?

Los secrets no se pueden editar directamente, debes:
1. Eliminar el secret existente
2. Crear uno nuevo con el mismo nombre y el valor correcto

---

**Nota:** Si solo tienes una configuración de Firebase, puedes ignorar los secrets con el sufijo `_2`.
