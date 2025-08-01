# Instrucciones para Agentes de IA - Web Editor

## 🏗️ Arquitectura del Sistema

Este es un **editor visual de widgets** construido con React que implementa un sistema de drag & drop modular y optimizado.

### **Flujo de Datos Principal**
```
App.jsx (useWidgetManager) → EditorCanvas → InteractiveWidget → MyRnd → Widget Components
```

- **`useWidgetManager`**: Estado global centralizado (widgets[], selectedId, editingWidgetId)
- **`EditorCanvas`**: Canvas 960x540px con bounds automáticos y gestión de selección
- **`InteractiveWidget`**: Wrapper que conecta widgets con sistema MyRnd
- **`MyRnd`**: Sistema interno de drag & resize con hooks especializados

## 🎯 Patrones Clave del Proyecto

### **Sistema de Widgets**
Cada widget se crea via `widgetFactory.js` con estructura estándar:
```javascript
{
  id: uuid(),
  type: "image" | "rectangle" | "circle" | "star",
  x, y, width, height,
  bounds: true/false, // Si está limitado al canvas
  rotation: 0,
  // propiedades específicas del tipo
}
```

### **Hooks Especializados en MyRnd**
- **`useDragLogic`**: Drag completamente libre, auto-delete si sale del canvas
- **`useResizeLogic`**: 8 handles, aspect ratio opcional, límites min/max
- **`useBoundsLogic`**: Bounds condicionales, detección de elementos fuera del canvas

### **Performance Crítica**
- **Solo actualizar estado al final**: `onDragStop`/`onResizeStop`, NO durante movimiento
- **Hardware acceleration**: `transform: translate3d(0,0,0)` en Widget.css
- **Memoización**: React.memo + useMemo para propiedades derivadas
- **Containment**: `contain: style` para evitar reflows

## 🔧 Comandos Esenciales

```bash
npm run dev        # Puerto 5173/5174 automático
npm run build      # Vite build optimizado
npm run lint       # ESLint con configuración específica
```

## 📐 Convenciones Específicas

### **Bounds System**
- `bounds: true` → Limitado al canvas (rectángulos, estrellas)
- `bounds: false` → Puede salir y ser eliminado (imágenes, círculos)
- Auto-delete cuando está completamente fuera durante drag

### **Estructura de Componentes**
```
src/components/widgets/
├── [Type]Widget.jsx     # Componente visual simple
├── WidgetRenderer.jsx   # Switch central de tipos
└── index.js            # Exports centralizados
```

### **MyRnd - Sistema Interno**
```
src/components/myrnd/
├── MyRnd.jsx           # Componente principal
├── hooks/              # Lógica separada por responsabilidad
│   ├── useDragLogic.js    # isDragging, movimiento libre
│   ├── useResizeLogic.js  # isResizing, 8 handles
│   └── useBoundsLogic.js  # applyBounds, checkOutOfBounds
└── components/
    └── ResizeHandles.jsx  # UI handles (se ocultan durante drag)
```

### **Estados de Interacción**
- **Normal**: Borde transparente, handles ocultos
- **Seleccionado**: Borde naranja (#FF6010), handles visibles
- **Dragging**: Cursor grabbing, handles ocultos, hardware acceleration
- **Resizing**: Cursores direccionales, aspect ratio opcional

## ⚠️ Consideraciones Importantes

### **NO Actualizar Durante Movimiento**
```javascript
// ❌ MAL - Causa lag
onDrag: (e, position) => updateWidget(id, position)

// ✅ BIEN - Solo al final
onDragStop: (e, finalPosition) => updateWidget(id, finalPosition)
```

### **Canvas Fijo**
- Dimensiones hardcodeadas: 960x540px en `editorCanvas.styles.js`
- Background con grid de 24x24px
- No cambiar sin actualizar bounds en MyRnd

### **Validación de NaN**
El sistema incluye validación automática, pero siempre verificar:
```javascript
if (typeof position.x !== 'number' || isNaN(position.x)) return;
```

### **Eliminación de Widgets**
- Método preferido: Drag fuera del canvas (auto-delete)
- Método alternativo: Botón "Remove Selected" en Toolbar
- La eliminación cancela automáticamente el drag activo

## 🎨 Estilos y CSS

### **Hardware Acceleration Obligatoria**
```css
.interactive-widget {
  transform: translate3d(0, 0, 0);
  will-change: transform;
  backface-visibility: hidden;
}
```

### **Z-Index Hierarchy**
- Widgets base: z-index 1000
- Overlay handles: z-index 1001
- Editing mode: z-index 1000

### **Drag Handle Pattern**
Todos los widgets deben tener `className="drag-handle"` en su contenido para permitir drag.

## 🐛 Debugging

### **Logs Útiles**
```javascript
console.log('Widget state:', widget);
console.log('Position:', { x, y });
console.log('Bounds check:', checkOutOfBounds(position, size));
```

### **Problemas Comunes**
- **No se mueve**: Verificar `dragHandleClassName="drag-handle"`
- **No redimensiona**: Confirmar `enableResizing={true}` en MyRnd
- **Posición NaN**: Sistema valida automáticamente, verificar props iniciales

## 📝 Antes de Modificar

1. **Widget nuevo**: Agregar a `widgetFactory.js`, `WidgetRenderer.jsx`, `Toolbar.jsx`
2. **MyRnd changes**: Testear con todos los tipos de widget
3. **Performance**: Verificar que no se actualiza estado durante drag/resize
4. **Bounds**: Confirmar comportamiento con elementos dentro/fuera del canvas

El sistema está optimizado para 60fps durante interacciones. Mantener la separación de responsabilidades en hooks especializados.
