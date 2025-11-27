# 📱 TriviaApp - Progressive Web App (PWA)

## 🎯 ¿Qué es una PWA?

Una **Progressive Web App (PWA)** es una aplicación web que se comporta como una aplicación nativa. TriviaApp ahora puede:

✅ **Instalarse** en dispositivos móviles y de escritorio  
✅ **Funcionar offline** (sin conexión a internet)  
✅ **Recibir notificaciones** push (futuro)  
✅ **Actualizarse automáticamente**  
✅ **Cargarse más rápido** gracias al caché  

## 🚀 Características Implementadas

### 1. **Instalación**
- Prompt personalizado para instalar la app
- Compatible con Android, iOS, Windows, macOS
- Icono personalizado en el home screen
- Pantalla de splash screen automática

### 2. **Service Worker**
- Caché automático de recursos estáticos
- Estrategia de caché para:
  - **Archivos estáticos** (JS, CSS, HTML): Cache First
  - **Google Fonts**: Cache First (1 año)
  - **Firebase Storage**: Network First (1 semana)

### 3. **Manifest**
- Nombre: "TriviaApp - UNSa"
- Tema: Azul (#3B82F6)
- Orientación: Portrait
- Display: Standalone
- Shortcuts a carreras y materias

### 4. **Iconos**
- Icon 192x192px (Android, Chrome)
- Icon 512x512px (Android, Chrome)
- Apple Touch Icons (iOS, Safari)

## 📦 Archivos Generados

```
public/
├── icon-192x192.png       # Icono pequeño
├── icon-512x512.png       # Icono grande
├── manifest.json          # Configuración PWA
└── sw.js                  # Service Worker (auto-generado)

src/
└── componentes/
    └── pwa/
        └── InstallPWA.jsx # Componente de instalación
```

## 🔧 Configuración Técnica

### Vite PWA Plugin

```javascript
VitePWA({
  registerType: 'autoUpdate',  // Actualización automática
  includeAssets: ['icon-*.png'],
  workbox: {
    // Estrategias de caché
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [...]
  }
})
```

### Estrategias de Caché

| Recurso | Estrategia | Duración |
|---------|-----------|----------|
| Archivos estáticos | Cache First | Indefinido |
| Google Fonts | Cache First | 1 año |
| Firebase Storage | Network First | 1 semana |

## 📱 Cómo Instalar la App

### **Android (Chrome)**
1. Abre la app en Chrome
2. Aparecerá un banner "Instalar TriviaApp"
3. Toca "Instalar"
4. La app se agregará al home screen

### **iOS (Safari)**
1. Abre la app en Safari
2. Toca el botón "Compartir" (cuadrado con flecha)
3. Selecciona "Agregar a pantalla de inicio"
4. Toca "Agregar"

### **Windows/Mac (Chrome/Edge)**
1. Abre la app en el navegador
2. Mira el ícono de instalación en la barra de direcciones
3. Haz clic en "Instalar TriviaApp"
4. La app se abrirá en una ventana independiente

## 🎨 Componente InstallPWA

El componente `InstallPWA.jsx` muestra un prompt personalizado para instalar la app:

### Características:
- ✅ Aparece después de 3 segundos
- ✅ Se oculta si el usuario ya instaló la app
- ✅ Guarda la preferencia si el usuario rechaza (7 días)
- ✅ Diseño atractivo con gradiente azul-púrpura
- ✅ Animación de entrada suave

### Uso:
```jsx
import InstallPWA from './componentes/pwa/InstallPWA';

function App() {
  return (
    <>
      {/* Tu app */}
      <InstallPWA />
    </>
  );
}
```

## 🧪 Probar la PWA

### En Desarrollo (localhost)
```bash
npm run dev
```
- El service worker está habilitado en desarrollo
- Puedes probar la instalación en Chrome DevTools
- Abre DevTools > Application > Manifest

### En Producción
```bash
npm run build
npm run preview
```
- Genera los archivos optimizados
- El service worker cachea todos los recursos
- Prueba la instalación en un dispositivo real

## 🔍 Verificar PWA

### Chrome DevTools
1. Abre DevTools (F12)
2. Ve a la pestaña **Application**
3. Verifica:
   - ✅ Manifest
   - ✅ Service Workers
   - ✅ Cache Storage
   - ✅ Offline functionality

### Lighthouse Audit
1. Abre DevTools (F12)
2. Ve a la pestaña **Lighthouse**
3. Selecciona "Progressive Web App"
4. Haz clic en "Analyze page load"
5. Deberías obtener un puntaje alto (90+)

## 📊 Métricas PWA

### Antes (Web Normal)
- ❌ No instalable
- ❌ No funciona offline
- ❌ Carga lenta en visitas repetidas
- ❌ No hay icono en home screen

### Después (PWA)
- ✅ Instalable en todos los dispositivos
- ✅ Funciona offline (recursos cacheados)
- ✅ Carga instantánea en visitas repetidas
- ✅ Icono personalizado en home screen
- ✅ Experiencia nativa

## 🚨 Troubleshooting

### El prompt de instalación no aparece
- Verifica que estés en HTTPS (o localhost)
- Revisa que el manifest.json esté correctamente configurado
- Asegúrate de que los iconos existan en `/public`
- Limpia el caché del navegador

### El service worker no se registra
- Verifica la consola del navegador
- Asegúrate de que `vite-plugin-pwa` esté instalado
- Revisa `vite.config.js`

### La app no funciona offline
- Verifica que el service worker esté activo
- Revisa Cache Storage en DevTools
- Asegúrate de haber visitado la página al menos una vez online

## 🔄 Actualización de la PWA

### Automática
- El service worker se actualiza automáticamente
- Los usuarios obtienen la nueva versión en la próxima visita
- No necesitan reinstalar la app

### Manual
```javascript
// En main.jsx o App.jsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(registration => {
    // Forzar actualización
    registration.update();
  });
}
```

## 📈 Próximas Mejoras

### Futuras Implementaciones:
- [ ] **Push Notifications** - Notificar nuevas preguntas
- [ ] **Background Sync** - Sincronizar datos offline
- [ ] **Share API** - Compartir preguntas
- [ ] **Shortcuts dinámicos** - Accesos rápidos personalizados
- [ ] **Badging API** - Mostrar contador de notificaciones

## 🎓 Recursos

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## ✅ Checklist de PWA

- [x] Manifest.json configurado
- [x] Service Worker implementado
- [x] Iconos en múltiples tamaños
- [x] HTTPS (requerido para producción)
- [x] Meta tags para PWA
- [x] Apple Touch Icons
- [x] Theme color
- [x] Prompt de instalación personalizado
- [x] Estrategias de caché
- [x] Offline fallback
- [x] Auto-actualización

## 🎉 ¡Listo!

Tu aplicación **TriviaApp** ahora es una PWA completa y puede instalarse en cualquier dispositivo. Los usuarios disfrutarán de:

- 🚀 Carga ultra rápida
- 📱 Experiencia nativa
- 🔌 Funcionamiento offline
- 💾 Menor consumo de datos
- 🎨 Icono personalizado

---

**Desarrollado con ❤️ para la comunidad UNSa**
