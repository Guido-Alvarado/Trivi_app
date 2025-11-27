# 🚀 Deployment - TriviaApp PWA

## 📋 Pre-requisitos

Antes de desplegar tu PWA, asegúrate de tener:

- ✅ Cuenta de Firebase (ya la tienes)
- ✅ Proyecto configurado en Firebase Console
- ✅ Firebase CLI instalado
- ✅ Dominio personalizado (opcional pero recomendado)

---

## 🔥 Opción 1: Firebase Hosting (Recomendado)

### Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Paso 2: Login en Firebase

```bash
firebase login
```

### Paso 3: Inicializar Firebase Hosting

```bash
firebase init hosting
```

Selecciona:
- ✅ Use an existing project
- ✅ Public directory: `dist`
- ✅ Configure as single-page app: `Yes`
- ✅ Set up automatic builds: `No` (por ahora)

### Paso 4: Configurar firebase.json

Crea/edita `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/sw.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      },
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Paso 5: Build de Producción

```bash
npm run build
```

### Paso 6: Deploy

```bash
firebase deploy --only hosting
```

### Paso 7: Verificar

Firebase te dará una URL como:
```
https://tu-proyecto.web.app
https://tu-proyecto.firebaseapp.com
```

---

## 🌐 Opción 2: Vercel

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Deploy

```bash
vercel
```

Sigue las instrucciones en pantalla.

### Configuración (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

---

## 🚢 Opción 3: Netlify

### Paso 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Paso 2: Deploy

```bash
netlify deploy --prod
```

### Configuración (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## ⚙️ Configuración de Dominio Personalizado

### Firebase Hosting

1. Ve a Firebase Console
2. Hosting > Add custom domain
3. Sigue las instrucciones para configurar DNS
4. Firebase configurará HTTPS automáticamente

### Vercel

1. Ve a tu proyecto en Vercel
2. Settings > Domains
3. Agrega tu dominio
4. Configura los DNS según las instrucciones

### Netlify

1. Ve a tu sitio en Netlify
2. Domain settings > Add custom domain
3. Configura los DNS según las instrucciones

---

## 🔒 HTTPS (Obligatorio para PWA)

### ¿Por qué HTTPS?

- ✅ Service Workers requieren HTTPS
- ✅ Instalación PWA requiere HTTPS
- ✅ Seguridad de datos
- ✅ SEO mejorado

### Opciones:

1. **Firebase Hosting** - HTTPS automático ✅
2. **Vercel** - HTTPS automático ✅
3. **Netlify** - HTTPS automático ✅
4. **Let's Encrypt** - Certificado gratis para servidor propio

---

## 📊 Post-Deployment

### 1. Verificar PWA

Abre Chrome DevTools:
- Application > Manifest ✅
- Application > Service Workers ✅
- Lighthouse > PWA Audit (90+) ✅

### 2. Probar Instalación

- Android: Chrome
- iOS: Safari
- Desktop: Chrome/Edge

### 3. Verificar Offline

- Instala la app
- Activa modo avión
- Abre la app
- Debe funcionar ✅

### 4. Monitorear

- Google Analytics
- Firebase Analytics
- Lighthouse CI
- Web Vitals

---

## 🔄 Actualizar la PWA

### Proceso:

1. Haz cambios en el código
2. Incrementa versión en `package.json`
3. Build: `npm run build`
4. Deploy: `firebase deploy` (o tu método)
5. Los usuarios obtendrán la actualización automáticamente

### Service Worker Auto-Update

El service worker se actualiza automáticamente:
- Verifica actualizaciones cada vez que se abre la app
- Descarga nueva versión en background
- Activa en la próxima visita

---

## 🧪 Testing en Producción

### Checklist:

- [ ] La app se carga correctamente
- [ ] El manifest.json es accesible
- [ ] Los iconos se muestran correctamente
- [ ] El service worker se registra
- [ ] Aparece el prompt de instalación
- [ ] La app funciona offline
- [ ] Las rutas funcionan correctamente
- [ ] Firebase se conecta correctamente
- [ ] No hay errores en la consola
- [ ] Lighthouse PWA score > 90

---

## 🚨 Troubleshooting

### Service Worker no se registra

```javascript
// Verifica en la consola
if ('serviceWorker' in navigator) {
  console.log('Service Worker soportado');
} else {
  console.log('Service Worker NO soportado');
}
```

### Manifest no se carga

- Verifica que `manifest.json` esté en `/public`
- Verifica que el link esté en `index.html`
- Revisa la consola para errores

### No aparece prompt de instalación

- Debe ser HTTPS (o localhost)
- El usuario no debe haber rechazado antes
- Debe cumplir criterios de instalación
- Espera unos segundos después de cargar

### Caché no funciona

- Verifica que el service worker esté activo
- Limpia el caché y recarga
- Revisa `vite.config.js`

---

## 📈 Optimizaciones

### 1. Comprimir Imágenes

```bash
# Optimizar iconos
npm install -g sharp-cli
sharp -i icon-512x512.png -o icon-512x512-optimized.png
```

### 2. Lazy Loading

```javascript
// En tus componentes
const LazyComponent = lazy(() => import('./Component'));
```

### 3. Code Splitting

Vite hace esto automáticamente, pero puedes optimizar:

```javascript
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        firebase: ['firebase/app', 'firebase/firestore']
      }
    }
  }
}
```

---

## 🎯 Métricas de Éxito

### Objetivos:

- 🎯 **Lighthouse PWA Score**: 90+
- 🎯 **First Contentful Paint**: < 1.5s
- 🎯 **Time to Interactive**: < 3s
- 🎯 **Instalaciones**: Monitorear con Analytics
- 🎯 **Usuarios Offline**: Monitorear uso sin conexión

---

## 📞 Comandos Útiles

```bash
# Build de producción
npm run build

# Preview local del build
npm run preview

# Deploy a Firebase
firebase deploy --only hosting

# Ver logs de Firebase
firebase hosting:channel:deploy preview

# Rollback (Firebase)
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

---

## ✅ Checklist Final de Deployment

- [ ] Build de producción sin errores
- [ ] Service worker generado correctamente
- [ ] Manifest.json válido
- [ ] Iconos optimizados
- [ ] HTTPS configurado
- [ ] Dominio personalizado (opcional)
- [ ] Firebase configurado
- [ ] Variables de entorno configuradas
- [ ] Analytics configurado
- [ ] Testing en dispositivos reales
- [ ] Documentación actualizada
- [ ] README.md con instrucciones

---

## 🎉 ¡Listo para Producción!

Tu PWA está lista para ser desplegada. Sigue estos pasos y tendrás una aplicación profesional, rápida y instalable.

**¡Éxito con el lanzamiento! 🚀**

---

*Desarrollado con ❤️ para la comunidad UNSa*
