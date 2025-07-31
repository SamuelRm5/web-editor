# MyRnd - Arquitectura Modular

## 📁 Estructura de Archivos

```
src/components/myrnd/
├── MyRnd.jsx                    # Componente principal (refactorizado)
├── MyRnd.css                    # Estilos con efectos de hover mejorados
├── index.js                     # Export principal
├── hooks/                       # Lógica separada en hooks personalizados
│   ├── index.js                # Exports centralizados de hooks
│   ├── useDragLogic.js         # Lógica de arrastre
│   ├── useResizeLogic.js       # Lógica de redimensionamiento
│   └── useBoundsLogic.js       # Lógica de límites y canvas
└── components/                  # Componentes UI separados
    ├── index.js                # Exports centralizados de componentes
    └── ResizeHandles.jsx       # Handles con efectos hover y ocultación
```

## 🧩 Hooks Personalizados

### **useDragLogic**
- ✅ Maneja toda la lógica de arrastre
- ✅ Estado `isDragging`
- ✅ Handlers: `handleMouseDownDrag`, `handleMouseMoveDrag`, `handleMouseUpDrag`
- ✅ Integración con bounds

### **useResizeLogic**
- ✅ Maneja toda la lógica de redimensionamiento
- ✅ Estado `isResizing` y `resizeHandle`
- ✅ Handlers: `handleMouseDownResize`, `handleMouseMoveResize`, `handleMouseUpResize`
- ✅ Soporte para aspect ratio y límites

### **useBoundsLogic**
- ✅ Aplicación de límites inteligentes
- ✅ Detección de elementos fuera del canvas
- ✅ Tolerancia configurable para eliminación
- ✅ Integración con `onOutOfBounds`

## 🎨 Componentes UI

### **ResizeHandles**
- ✅ **Ocultación automática**: Se ocultan durante drag (`isDragging`)
- ✅ **Efectos hover**: Relleno de color en hover
- ✅ **Estado visual**: Diferentes estilos para `resizing` y `hovered`
- ✅ **Configuración flexible**: Soporte para `resizeHandleConfig`

## 🎯 Nuevas Funcionalidades

### **1. Ocultación Inteligente de Handles**
```jsx
// Los handles se ocultan automáticamente durante drag
if (isDragging) return null;
```

### **2. Efectos Hover Mejorados**
```jsx
// Relleno de color en hover
style={{
  backgroundColor: hoveredHandle === handle ? "#FF6010" : "transparent",
  transition: "background-color 0.15s ease",
}}
```

### **3. CSS Optimizado**
```css
.resize-handle:hover,
.resize-handle.hovered {
  background-color: #FF6010 !important;
  border-color: #E55A0E;
  transform: scale(1.1);
}
```

## 📊 Beneficios de la Refactorización

### **Mantenibilidad**
- ✅ **Código modular**: Cada hook tiene una responsabilidad específica
- ✅ **Fácil testing**: Hooks se pueden testear independientemente
- ✅ **Debugging simplificado**: Errores localizados por módulo

### **Performance**
- ✅ **Bundle optimizado**: 214.73 kB (solo +2kB por modularización)
- ✅ **Reutilización**: Hooks pueden usarse en otros componentes
- ✅ **Lazy loading**: Posibilidad de cargar hooks bajo demanda

### **UX Mejorada**
- ✅ **Handles que se ocultan**: No interfieren durante drag
- ✅ **Feedback visual**: Hover con relleno de color
- ✅ **Transiciones suaves**: Efectos CSS optimizados

## 🚀 Uso

```jsx
import { MyRnd } from './components/myrnd';

// Uso normal - toda la funcionalidad integrada
<MyRnd
  size={{width: 100, height: 100}}
  position={{x: 50, y: 50}}
  enableResizing={true}
  // ... otras props
>
  <div>Contenido</div>
</MyRnd>
```

---

**MyRnd ahora es mucho más legible, mantenible y con mejor UX gracias a la separación de responsabilidades y las nuevas funcionalidades visuales.** 🎉
