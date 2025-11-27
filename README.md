# 📱 TriviaApp - Progressive Web App

![PWA Ready](https://img.shields.io/badge/PWA-Ready-success)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.2-purple)
![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange)

## 🎯 Descripción

**TriviaApp** es una Progressive Web App (PWA) diseñada para estudiantes de la Universidad Nacional de Salta (UNSa). Permite crear, compartir y practicar con preguntas de trivia organizadas por carreras, materias y unidades.

### ✨ Características Principales

- 📚 **Gestión de Carreras**: Explora y selecciona tu carrera
- 📖 **Materias Organizadas**: Materias por año académico
- ❓ **Banco de Preguntas**: Miles de preguntas validadas por la comunidad
- 🎯 **Quizzes Interactivos**: Practica con exámenes simulados
- ⭐ **Sistema de Votación**: Valida preguntas de calidad
- 💾 **Funciona Offline**: Accede a contenido sin internet
- 📱 **Instalable**: Como una app nativa en tu dispositivo

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase (para backend)

### Instalación

```bash
# Clonar el repositorio
git clone [tu-repo-url]
cd Trivi_app

# Instalar dependencias
npm install

# Configurar variables de entorno
# Copia .env.example a .env y configura tus credenciales de Firebase

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5171`

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo con HMR

# Producción
npm run build        # Genera build optimizado para producción
npm run preview      # Preview del build de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint
```

---

## 🏗️ Tecnologías

### Frontend
- **React 19.1.1** - Librería UI
- **Vite 7.1.2** - Build tool y dev server
- **React Router 7.9.3** - Navegación
- **Tailwind CSS 4.1.13** - Estilos
- **Lucide React** - Iconos

### Backend
- **Firebase 12.3.0**
  - Firestore - Base de datos
  - Authentication - Autenticación con Google
  - Storage - Almacenamiento de archivos

### PWA
- **Vite PWA Plugin** - Service Worker y Manifest
- **Workbox** - Estrategias de caché

---

## 📱 Progressive Web App

TriviaApp es una PWA completa que ofrece:

### ✅ Instalación
- Instalable en Android, iOS, Windows, macOS
- Icono personalizado en home screen
- Experiencia standalone (sin barra del navegador)

### ✅ Offline Support
- Funciona sin conexión a internet
- Caché inteligente de recursos
- Sincronización automática cuando vuelve la conexión

### ✅ Performance
- Carga instantánea en visitas repetidas
- Service Worker optimizado
- Code splitting automático

### 📚 Documentación PWA

- [📱 Guía de Instalación](./GUIA_INSTALACION_PWA.md) - Para usuarios
- [📖 Documentación Técnica](./PWA_DOCUMENTATION.md) - Para desarrolladores
- [🚀 Deployment](./DEPLOYMENT_PWA.md) - Guía de despliegue
- [📋 Resumen](./PWA_RESUMEN.md) - Resumen ejecutivo

---

## 🗂️ Estructura del Proyecto

```
Trivi_app/
├── public/
│   ├── icon-192x192.png      # Icono PWA pequeño
│   ├── icon-512x512.png      # Icono PWA grande
│   └── manifest.json         # Manifest PWA
├── src/
│   ├── componentes/
│   │   ├── card/            # Componentes de tarjetas
│   │   ├── elementos/       # Elementos reutilizables
│   │   ├── forms/           # Formularios
│   │   ├── modals/          # Modales
│   │   ├── pwa/             # Componentes PWA
│   │   └── tolbar/          # Barra de herramientas
│   ├── pages/               # Páginas de la app
│   ├── firebaseConfig.js    # Configuración Firebase
│   ├── App.jsx              # Componente principal
│   └── main.jsx             # Entry point
├── .env                     # Variables de entorno
├── vite.config.js           # Configuración Vite + PWA
└── package.json             # Dependencias
```

---

## 🔥 Configuración de Firebase

### 1. Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Firestore Database
4. Habilita Authentication (Google)

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 3. Estructura de Firestore

```
UNSa/
├── carreras/              # Documento con array de carreras
├── {nombreCarrera}/       # Colección por carrera
│   └── materias/         # Subcolección de materias
│       └── {materia}/    # Documento de materia
│           └── Preguntas # Array de preguntas
```

---

## 🎨 Características de la UI

### Diseño Responsivo
- Mobile-first approach
- Optimizado para tablets y desktop
- Breakpoints personalizados

### Tema
- Color principal: Azul (#3B82F6)
- Color secundario: Púrpura (#8B5CF6)
- Modo claro optimizado
- Gradientes modernos

### Componentes Reutilizables
- Cards interactivas
- Modales animados
- Formularios validados
- Buscadores con filtros
- Toolbars personalizables

---

## 🔐 Autenticación

### Google Sign-In
- Login con cuenta de Google
- Identificación de usuarios
- Control de permisos (admin/usuario)
- Prevención de spam

### Roles
- **Usuario**: Puede votar y proponer contenido
- **Admin**: Puede eliminar y gestionar contenido

---

## 📊 Sistema de Votación

### Validación Comunitaria
- Las preguntas necesitan 20 votos para ser validadas
- Sistema anti-spam (un voto por usuario)
- Historial de votaciones en localStorage

### Reportes
- Los usuarios pueden reportar contenido inapropiado
- Sistema de moderación para admins

---

## 🚀 Deployment

### GitHub Pages (Recomendado) ⭐

El proyecto está configurado para despliegue automático en GitHub Pages con GitHub Actions.

#### Pasos Rápidos:

1. **Configurar el nombre del repositorio** en:
   - `vite.config.js` (línea 10 y 27)
   - `src/App.jsx` (línea 21)

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Crear repositorio en GitHub y subir el código:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```

4. **Configurar GitHub Pages:**
   - Ve a Settings → Pages
   - Selecciona "GitHub Actions" como Source

5. **Configurar Secrets de Firebase:**
   - Ve a Settings → Secrets and variables → Actions
   - Agrega todas las variables de entorno de Firebase

**📚 Documentación Completa:**
- [⚡ Pasos Rápidos](./DEPLOY_RAPIDO.md)
- [📖 Guía Completa](./DEPLOY_GITHUB_PAGES.md)
- [🔐 Configurar Secrets](./CONFIGURAR_SECRETS.md)
- [✅ Checklist](./CHECKLIST_DEPLOY.md)

### Firebase Hosting

```bash
# Build de producción
npm run build

# Deploy a Firebase
firebase deploy --only hosting
```

### Otras Opciones
- Vercel
- Netlify

Ver [DEPLOYMENT_PWA.md](./DEPLOYMENT_PWA.md) para más opciones.

---

## 🧪 Testing

### Verificar PWA

1. Abre Chrome DevTools (F12)
2. Ve a **Application** > **Manifest**
3. Verifica que todos los campos estén correctos
4. Ve a **Service Workers**
5. Verifica que esté "activated and running"

### Lighthouse Audit

1. Abre Chrome DevTools (F12)
2. Ve a **Lighthouse**
3. Selecciona "Progressive Web App"
4. Ejecuta el audit
5. Objetivo: Score 90+

---

## 📈 Roadmap

### Próximas Características

- [ ] **Push Notifications** - Notificar nuevas preguntas
- [ ] **Background Sync** - Sincronización offline
- [ ] **Share API** - Compartir preguntas
- [ ] **Modo Oscuro** - Theme switcher
- [ ] **Estadísticas** - Dashboard de progreso
- [ ] **Leaderboard** - Ranking de usuarios
- [ ] **Badges** - Sistema de logros

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

---

## 👥 Autores

- **Desarrollador Principal** - [Tu Nombre]
- **Comunidad UNSa** - Contribuidores de contenido

---

## 🙏 Agradecimientos

- Universidad Nacional de Salta (UNSa)
- Comunidad de estudiantes
- Contribuidores de preguntas
- Firebase por el backend gratuito
- Vite por el excelente tooling

---

## 📞 Soporte

¿Necesitas ayuda?

- 📧 Email: [tu-email]
- 💬 Discord: [tu-discord]
- 🐛 Issues: [GitHub Issues]

---

## 🌟 ¡Dale una estrella!

Si este proyecto te ayudó, considera darle una ⭐ en GitHub!

---

**Desarrollado con ❤️ para la comunidad UNSa**

*Última actualización: Noviembre 2025*
