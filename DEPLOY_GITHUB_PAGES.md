# 🚀 Guía de Despliegue en GitHub Pages

Esta guía te ayudará a desplegar tu aplicación TriviaApp en GitHub Pages.

## 📋 Requisitos Previos

1. Una cuenta de GitHub
2. Git instalado en tu computadora
3. Node.js y npm instalados

## 🔧 Configuración Inicial

### 1. Configurar el nombre del repositorio

Antes de desplegar, asegúrate de que el nombre del repositorio en `vite.config.js` coincida con el nombre de tu repositorio en GitHub.

**En `vite.config.js`, línea 10:**
```javascript
base: process.env.NODE_ENV === 'production' ? '/NOMBRE-DE-TU-REPO/' : '/',
```

Reemplaza `NOMBRE-DE-TU-REPO` con el nombre exacto de tu repositorio en GitHub.

**Ejemplo:**
- Si tu repositorio se llama `trivia-app`, usa: `'/trivia-app/'`
- Si tu repositorio se llama `Trivi_app`, usa: `'/Trivi_app/'`

### 2. Crear el repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"New"** o **"+"** → **"New repository"**
3. Nombra tu repositorio (por ejemplo: `Trivi_app`)
4. Puedes dejarlo público o privado
5. **NO** inicialices con README, .gitignore o licencia (ya los tienes localmente)
6. Haz clic en **"Create repository"**

### 3. Conectar tu proyecto local con GitHub

Abre la terminal en la carpeta de tu proyecto y ejecuta:

```bash
# Inicializar git (si aún no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit - TriviaApp ready for deployment"

# Agregar el repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/TU-USUARIO/NOMBRE-DE-TU-REPO.git

# Cambiar a la rama main (si estás en master)
git branch -M main

# Subir los cambios
git push -u origin main
```

## 🎯 Métodos de Despliegue

Hay **dos formas** de desplegar tu aplicación:

### Método 1: Despliegue Automático con GitHub Actions (Recomendado) ⭐

Este método desplegará automáticamente tu aplicación cada vez que hagas push a la rama `main`.

#### Pasos:

1. **Habilitar GitHub Pages en tu repositorio:**
   - Ve a tu repositorio en GitHub
   - Haz clic en **Settings** (Configuración)
   - En el menú lateral, haz clic en **Pages**
   - En **Source**, selecciona **"GitHub Actions"**

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Hacer push a GitHub:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push
   ```

4. **Verificar el despliegue:**
   - Ve a la pestaña **Actions** en tu repositorio
   - Deberías ver un workflow ejecutándose
   - Espera a que termine (toma unos minutos)
   - Tu aplicación estará disponible en: `https://TU-USUARIO.github.io/NOMBRE-DE-TU-REPO/`

### Método 2: Despliegue Manual con gh-pages

Este método requiere que ejecutes un comando cada vez que quieras actualizar tu aplicación.

#### Pasos:

1. **Instalar dependencias (incluyendo gh-pages):**
   ```bash
   npm install
   ```

2. **Construir y desplegar:**
   ```bash
   npm run deploy
   ```

3. **Habilitar GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Haz clic en **Settings** → **Pages**
   - En **Source**, selecciona la rama **"gh-pages"**
   - Haz clic en **Save**

4. **Acceder a tu aplicación:**
   - Espera unos minutos
   - Tu aplicación estará disponible en: `https://TU-USUARIO.github.io/NOMBRE-DE-TU-REPO/`

## 🔄 Actualizar tu Aplicación

### Con GitHub Actions (Método 1):
Simplemente haz push de tus cambios:
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### Con gh-pages (Método 2):
Ejecuta el comando de deploy:
```bash
npm run deploy
```

## 🐛 Solución de Problemas

### La aplicación muestra una página en blanco

**Causa:** El `base` en `vite.config.js` no coincide con el nombre del repositorio.

**Solución:**
1. Verifica que el nombre en `base` sea exactamente igual al nombre de tu repositorio
2. Reconstruye y despliega nuevamente

### Los assets (imágenes, CSS, JS) no cargan

**Causa:** Rutas incorrectas en el código.

**Solución:**
- Asegúrate de usar rutas relativas en tu código
- Los assets en la carpeta `public` se copian automáticamente
- Las imágenes importadas en componentes funcionan correctamente

### El workflow de GitHub Actions falla

**Solución:**
1. Ve a la pestaña **Actions** en GitHub
2. Haz clic en el workflow fallido
3. Revisa los logs para ver el error específico
4. Verifica que todas las dependencias estén en `package.json`

### La PWA no se instala en producción

**Solución:**
- GitHub Pages usa HTTPS automáticamente, así que la PWA debería funcionar
- Limpia la caché del navegador
- Verifica que los iconos estén en la carpeta `public`

## 📱 Verificar la PWA

Una vez desplegada, puedes verificar que la PWA funciona correctamente:

1. Abre tu aplicación en Chrome/Edge
2. Abre las DevTools (F12)
3. Ve a la pestaña **Application** → **Manifest**
4. Verifica que el manifest se cargue correctamente
5. Ve a **Service Workers** y verifica que esté registrado

## 🎉 ¡Listo!

Tu aplicación ahora está desplegada en GitHub Pages y disponible para todo el mundo. Puedes compartir el enlace:

```
https://TU-USUARIO.github.io/NOMBRE-DE-TU-REPO/
```

## 📚 Recursos Adicionales

- [Documentación de GitHub Pages](https://docs.github.com/es/pages)
- [Documentación de Vite](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [Documentación de gh-pages](https://github.com/tschaub/gh-pages)

---

**Nota:** Si tienes variables de entorno (archivo `.env`), asegúrate de configurarlas como **Secrets** en GitHub:
1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Agrega tus variables como secrets
3. Actualiza el workflow para usarlas
