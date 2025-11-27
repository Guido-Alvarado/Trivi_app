# 🔔 Reporte de Alerts en TriviaApp

## ✅ Alerts Reemplazados con Modales

### CarrerasGuardadas.jsx
- ✅ **Línea 53**: "No hay carreras para subir" → Modal de Lista Vacía
- ✅ **Línea 63**: "Debes iniciar sesión" → Modal de Error de Autenticación
- ✅ **Línea 108**: "Error al subir carreras" → Modal de Error de Subida

---

## 📋 Alerts Pendientes por Reemplazar

### 🔴 Prioridad Alta (Errores y Validaciones Importantes)

#### VistaMateriasCandidatas.jsx
1. **Línea 50**: `alert("No hay carrera seleccionada");`
   - **Contexto**: Validación al cargar la página
   - **Sugerencia**: Modal de error con redirección

2. **Línea 234**: `alert("Error al registrar votos");`
   - **Contexto**: Error al votar
   - **Sugerencia**: Modal de error

3. **Línea 313**: `alert("Materias eliminadas correctamente.");`
   - **Contexto**: Confirmación de eliminación
   - **Sugerencia**: Modal de éxito (ya existe similar)

4. **Línea 317**: `alert("Error al eliminar materias");`
   - **Contexto**: Error al eliminar
   - **Sugerencia**: Modal de error

#### VistaBD.jsx (Preguntas)
5. **Línea 246**: `alert("Error: No hay carrera seleccionada.");`
   - **Contexto**: Validación al votar
   - **Sugerencia**: Modal de error

6. **Línea 288**: `alert("Error al registrar votos");`
   - **Contexto**: Error al votar
   - **Sugerencia**: Modal de error

7. **Línea 392**: `alert("Preguntas eliminadas correctamente.");`
   - **Contexto**: Confirmación de eliminación
   - **Sugerencia**: Modal de éxito

8. **Línea 396**: `alert("Error al eliminar preguntas");`
   - **Contexto**: Error al eliminar
   - **Sugerencia**: Modal de error

#### VistaCarreras.jsx
9. **Línea 163**: `alert("¡Votos registrados correctamente!");`
   - **Contexto**: Confirmación de votos
   - **Sugerencia**: Modal de éxito (ya existe en materias)

10. **Línea 167**: `alert("Error al registrar votos");`
    - **Contexto**: Error al votar
    - **Sugerencia**: Modal de error

11. **Línea 251**: `alert("Carreras eliminadas correctamente.");`
    - **Contexto**: Confirmación de eliminación
    - **Sugerencia**: Modal de éxito

12. **Línea 255**: `alert("Error al eliminar carreras");`
    - **Contexto**: Error al eliminar
    - **Sugerencia**: Modal de error

#### PreguntasGuardadas.jsx
13. **Línea 133**: `alert("Error: No hay carrera seleccionada.");`
    - **Contexto**: Validación antes de subir
    - **Sugerencia**: Modal de error

14. **Línea 139**: `alert("Error: Debes estar logueado para subir preguntas.");`
    - **Contexto**: Validación de autenticación
    - **Sugerencia**: Modal de error de autenticación

15. **Línea 195**: `alert("Error al subir las preguntas. Intenta nuevamente.");`
    - **Contexto**: Error al subir
    - **Sugerencia**: Modal de error

#### MateriasGuardadas.jsx
16. **Línea 66**: `alert("Error: No hay carrera seleccionada.");`
    - **Contexto**: Validación antes de subir
    - **Sugerencia**: Modal de error

17. **Línea 72**: `alert("Error: Debes estar logueado para subir materias.");`
    - **Contexto**: Validación de autenticación
    - **Sugerencia**: Modal de error de autenticación

18. **Línea 104**: `alert("Todas las materias ya existen en la nube.");`
    - **Contexto**: Información
    - **Sugerencia**: Modal informativo

19. **Línea 131**: `alert("Error al subir las materias. Intenta nuevamente.");`
    - **Contexto**: Error al subir
    - **Sugerencia**: Modal de error

---

### 🟡 Prioridad Media (Mensajes de Bienvenida y Confirmaciones)

#### VistaMateriasCandidatas.jsx
20. **Línea 153**: `alert("¡Bienvenido ${user.displayName}! Ahora puedes proponer materias.");`
    - **Contexto**: Mensaje de bienvenida después de login
    - **Sugerencia**: Modal de bienvenida o toast notification

21. **Línea 250**: `alert("Reporte enviado. Gracias por ayudarnos...");`
    - **Contexto**: Confirmación de reporte
    - **Sugerencia**: Modal de éxito

#### VistaCarreras.jsx
22. **Línea 183**: `alert("Reporte enviado. Gracias por ayudarnos...");`
    - **Contexto**: Confirmación de reporte
    - **Sugerencia**: Modal de éxito

23. **Línea 289**: `alert("¡Bienvenido ${user.displayName}! Ahora puedes agregar carreras.");`
    - **Contexto**: Mensaje de bienvenida después de login
    - **Sugerencia**: Modal de bienvenida

#### VistaBD.jsx
24. **Línea 199**: `alert("¡Bienvenido ${user.displayName}! Ahora puedes agregar preguntas.");`
    - **Contexto**: Mensaje de bienvenida después de login
    - **Sugerencia**: Modal de bienvenida

---

### 🟢 Prioridad Baja (Funcionalidades Secundarias o Debug)

#### EditarPregunta.jsx
25. **Línea 33**: `alert("Pregunta no encontrada.");`
    - **Contexto**: Error al editar
    - **Sugerencia**: Modal de error con redirección

#### Toolbard.jsx
26. **Línea 22**: `alert("Número recibido: ${numero}");`
    - **Contexto**: Debug/Testing
    - **Sugerencia**: Eliminar o comentar (parece código de prueba)

#### CardInicio.jsx
27. **Línea 74**: `alert("Error al iniciar sesión con Google");`
    - **Contexto**: Error de autenticación
    - **Sugerencia**: Modal de error

28. **Línea 96**: `alert("Función ${tipo} aún no implementada");`
    - **Contexto**: Funcionalidad pendiente
    - **Sugerencia**: Modal informativo o eliminar

29. **Línea 299**: `alert("Redirigiendo a opciones de contacto...");`
    - **Contexto**: Información
    - **Sugerencia**: Toast notification o eliminar

30. **Línea 346**: `alert("Redirigiendo a opciones de contacto...");`
    - **Contexto**: Información
    - **Sugerencia**: Toast notification o eliminar

#### MateriaCandidataItem.jsx
31. **Línea 41**: `alert("ID copiado al portapapeles");`
    - **Contexto**: Confirmación de copia
    - **Sugerencia**: Toast notification pequeño

#### PreguntasItem.jsx
32. **Línea 36**: `alert("ID copiado al portapapeles");`
    - **Contexto**: Confirmación de copia
    - **Sugerencia**: Toast notification pequeño

#### CardListas.jsx
33. **Línea 56**: `alert("Materia guardada correctamente ✅");`
    - **Contexto**: Confirmación de guardado
    - **Sugerencia**: Toast notification

34. **Línea 69**: `alert("ID copiado al portapapeles");`
    - **Contexto**: Confirmación de copia
    - **Sugerencia**: Toast notification pequeño

---

## 📊 Resumen

| Categoría | Cantidad | Estado |
|-----------|----------|--------|
| **Reemplazados** | 3 | ✅ Completado |
| **Prioridad Alta** | 19 | ⏳ Pendiente |
| **Prioridad Media** | 5 | ⏳ Pendiente |
| **Prioridad Baja** | 10 | ⏳ Pendiente |
| **TOTAL** | **37 alerts** | - |

---

## 🎯 Recomendaciones

### Tipos de Modales a Crear

1. **Modal de Error Genérico**
   - Reutilizable para todos los errores
   - Props: título, mensaje, icono

2. **Modal de Éxito Genérico**
   - Para confirmaciones
   - Props: título, mensaje

3. **Modal de Información**
   - Para mensajes informativos
   - Props: título, mensaje, color

4. **Toast Notifications**
   - Para mensajes breves (copiar ID, guardado rápido)
   - Auto-desaparece en 3 segundos
   - Posición: esquina superior derecha

### Patrón Sugerido

```javascript
// Estado
const [showModal, setShowModal] = useState(false);
const [modalConfig, setModalConfig] = useState({
  type: 'error', // 'error', 'success', 'info', 'warning'
  title: '',
  message: ''
});

// Función helper
const showMessage = (type, title, message) => {
  setModalConfig({ type, title, message });
  setShowModal(true);
};

// Uso
showMessage('error', 'Error', 'No hay carreras para subir');
```

---

## 🚀 Próximos Pasos

### Fase 1: Críticos (Ahora)
- [ ] Reemplazar alerts de error en páginas de guardado
- [ ] Reemplazar alerts de validación de autenticación
- [ ] Reemplazar alerts de error al subir datos

### Fase 2: Importantes (Esta semana)
- [ ] Reemplazar alerts de confirmación de eliminación
- [ ] Reemplazar alerts de error al votar
- [ ] Reemplazar mensajes de bienvenida

### Fase 3: Mejoras (Próxima semana)
- [ ] Implementar sistema de Toast Notifications
- [ ] Reemplazar alerts de "ID copiado"
- [ ] Limpiar código de debug

---

## 💡 Componente Modal Reutilizable

Crear: `src/componentes/modals/AlertModal.jsx`

```javascript
import React from 'react';
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-react';

export default function AlertModal({ 
  show, 
  onClose, 
  type = 'info', 
  title, 
  message,
  buttonText = 'Entendido'
}) {
  if (!show) return null;

  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    error: {
      icon: X,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonColor: 'bg-orange-600 hover:bg-orange-700'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Icon size={32} className={config.iconColor} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-6">{message}</p>
          <button
            onClick={onClose}
            className={`w-full ${config.buttonColor} text-white font-bold py-3 rounded-xl transition shadow-lg`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

**Última actualización**: 26 de Noviembre, 2025
