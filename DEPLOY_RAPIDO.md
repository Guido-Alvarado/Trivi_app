# ⚡ Pasos Rápidos para Deploy en GitHub Pages

## 🎯 Antes de Empezar

**IMPORTANTE:** Actualiza el nombre del repositorio en estos archivos:

1. **`vite.config.js` (línea 10):**
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/TU-REPO/' : '/',
   ```

2. **`vite.config.js` (línea 27):**
   ```javascript
   start_url: process.env.NODE_ENV === 'production' ? '/TU-REPO/' : '/',
   ```

3. **`src/App.jsx` (línea 21):**
   ```javascript
   const basename = import.meta.env.MODE === 'production' ? '/TU-REPO' : '';
   ```

Reemplaza `TU-REPO` con el nombre exacto de tu repositorio (sin las barras `/`).

## 📝 Pasos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Crear repositorio en GitHub
- Ve a github.com
- Crea un nuevo repositorio
- Copia la URL del repositorio

### 3. Conectar con GitHub
```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

### 4. Habilitar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Pages**
3. En **Source**, selecciona **"GitHub Actions"**

### 5. ¡Listo! 🎉
- El deploy se ejecutará automáticamente
- Ve a la pestaña **Actions** para ver el progreso
- Tu app estará en: `https://TU-USUARIO.github.io/TU-REPO/`

## 🔄 Para actualizar después

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

El deploy se ejecutará automáticamente.

---

**Ver guía completa:** [DEPLOY_GITHUB_PAGES.md](./DEPLOY_GITHUB_PAGES.md)
