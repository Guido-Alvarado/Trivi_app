# ✅ Checklist de Deploy - GitHub Pages

Usa este checklist para asegurarte de que todo esté configurado correctamente antes de hacer el deploy.

## 📋 Antes de Empezar

- [ ] Tienes una cuenta de GitHub
- [ ] Git está instalado en tu computadora
- [ ] Node.js y npm están instalados
- [ ] Tienes las credenciales de Firebase a mano

## 🔧 Configuración del Proyecto

### 1. Nombre del Repositorio

- [ ] Decidiste el nombre de tu repositorio (ejemplo: `Trivi_app`)
- [ ] Actualizaste el nombre en `vite.config.js` línea 10:
  ```javascript
  base: process.env.NODE_ENV === 'production' ? '/TU-REPO/' : '/',
  ```
- [ ] Actualizaste el nombre en `vite.config.js` línea 27:
  ```javascript
  start_url: process.env.NODE_ENV === 'production' ? '/TU-REPO/' : '/',
  ```
- [ ] Actualizaste el nombre en `src/App.jsx` línea 21:
  ```javascript
  const basename = import.meta.env.MODE === 'production' ? '/TU-REPO' : '';
  ```

### 2. Dependencias

- [ ] Ejecutaste `npm install` para instalar todas las dependencias
- [ ] No hay errores en la instalación

### 3. Variables de Entorno

- [ ] Tienes tu archivo `.env` local con las credenciales de Firebase
- [ ] El archivo `.env` NO está en el repositorio (está en `.gitignore`)
- [ ] Tienes las credenciales listas para configurar en GitHub Secrets

## 🚀 Crear y Configurar Repositorio en GitHub

### 4. Crear Repositorio

- [ ] Creaste un nuevo repositorio en GitHub
- [ ] El nombre del repositorio coincide con el configurado en los archivos
- [ ] El repositorio está vacío (sin README, .gitignore, o licencia)

### 5. Conectar con GitHub

- [ ] Ejecutaste `git init` en tu proyecto
- [ ] Ejecutaste `git add .`
- [ ] Ejecutaste `git commit -m "Initial commit - Ready for deployment"`
- [ ] Agregaste el remote: `git remote add origin URL-DE-TU-REPO`
- [ ] Ejecutaste `git branch -M main`
- [ ] Ejecutaste `git push -u origin main`
- [ ] Los archivos se subieron correctamente a GitHub

### 6. Configurar GitHub Pages

- [ ] Fuiste a Settings → Pages en tu repositorio
- [ ] Seleccionaste **"GitHub Actions"** como Source
- [ ] Guardaste los cambios

### 7. Configurar Secrets de Firebase

- [ ] Fuiste a Settings → Secrets and variables → Actions
- [ ] Agregaste `VITE_FIREBASE_API_KEY`
- [ ] Agregaste `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] Agregaste `VITE_FIREBASE_DATABASE_URL`
- [ ] Agregaste `VITE_FIREBASE_PROJECT_ID`
- [ ] Agregaste `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] Agregaste `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] Agregaste `VITE_FIREBASE_APP_ID`
- [ ] Agregaste `VITE_FIREBASE_MEASUREMENT_ID`

**Si usas Firebase Config 2:**
- [ ] Agregaste `VITE_FIREBASE_API_KEY_2`
- [ ] Agregaste `VITE_FIREBASE_AUTH_DOMAIN_2`
- [ ] Agregaste `VITE_FIREBASE_DATABASE_URL_2`
- [ ] Agregaste `VITE_FIREBASE_PROJECT_ID_2`
- [ ] Agregaste `VITE_FIREBASE_STORAGE_BUCKET_2`
- [ ] Agregaste `VITE_FIREBASE_MESSAGING_SENDER_ID_2`
- [ ] Agregaste `VITE_FIREBASE_APP_ID_2`
- [ ] Agregaste `VITE_FIREBASE_MEASUREMENT_ID_2`

## 🎯 Verificar Deploy

### 8. Workflow de GitHub Actions

- [ ] Fuiste a la pestaña **Actions** en GitHub
- [ ] Ves un workflow ejecutándose o completado
- [ ] El workflow se completó exitosamente (✅ verde)
- [ ] No hay errores en los logs

### 9. Verificar la Aplicación

- [ ] Accediste a `https://TU-USUARIO.github.io/TU-REPO/`
- [ ] La aplicación carga correctamente
- [ ] No hay errores 404 en la consola del navegador
- [ ] Las imágenes y assets cargan correctamente
- [ ] La navegación entre páginas funciona
- [ ] Firebase está conectado correctamente

### 10. Verificar PWA

- [ ] Abriste la aplicación en Chrome/Edge
- [ ] Abriste DevTools (F12) → Application → Manifest
- [ ] El manifest se carga correctamente
- [ ] Los iconos se muestran correctamente
- [ ] El Service Worker está registrado (Application → Service Workers)
- [ ] Puedes instalar la PWA (aparece el botón de instalación)

## 🔄 Actualizaciones Futuras

### 11. Para actualizar la aplicación

- [ ] Haces cambios en tu código local
- [ ] Ejecutas `git add .`
- [ ] Ejecutas `git commit -m "Descripción de cambios"`
- [ ] Ejecutas `git push`
- [ ] Verificas que el workflow se ejecute en GitHub Actions
- [ ] Verificas que los cambios se reflejen en la URL de producción

## 🐛 Solución de Problemas

Si algo no funciona, revisa:

- [ ] Los nombres de los archivos y rutas son correctos
- [ ] El nombre del repositorio coincide en todos los archivos
- [ ] Todos los secrets están configurados en GitHub
- [ ] Los valores de los secrets son correctos
- [ ] El workflow se completó sin errores
- [ ] Limpiaste la caché del navegador

## 📚 Recursos

- [ ] Leíste `DEPLOY_RAPIDO.md` para pasos rápidos
- [ ] Leíste `DEPLOY_GITHUB_PAGES.md` para la guía completa
- [ ] Leíste `CONFIGURAR_SECRETS.md` para configurar Firebase

---

## 🎉 ¡Felicitaciones!

Si completaste todos los pasos, tu aplicación TriviaApp está desplegada en GitHub Pages y lista para usar.

**URL de tu aplicación:** `https://TU-USUARIO.github.io/TU-REPO/`

Comparte este enlace con tus usuarios y disfruta de tu aplicación en producción! 🚀
