# MyRnd - Sistema Completo de Drag & Resize

## 🎯 Visión General

MyRnd es el sistema personalizado de drag & resize del Web Editor, diseñado para proporcionar interacciones fluidas y configurables para diferentes tipos de widgets. Integra un sistema de configuración centralizada que permite comportamientos específicos por tipo de widget.

## 📁 Arquitectura del Sistema

```
src/components/myrnd/
├── MyRnd.jsx                    # Componente principal con configuración automática
├── MyRnd.css                    # Estilos optimizados con animaciones
├── index.js                     # Exports principales
├── hooks/                       # Lógica separada por responsabilidad
│   ├── useDragLogic.js         # Drag libre con auto-delete
│   ├── useResizeLogic.js       # Resize con aspect ratio condicional
│   └── useBoundsLogic.js       # Gestión de límites y canvas
└── components/
    └── ResizeHandles.jsx       # Handles dinámicos por widget
```

## 🔧 Configuración Automática por Widget

### **Sistema Centralizado**
MyRnd obtiene automáticamente su configuración desde `widgetResizeConfig.js`:

```jsx
// Configuración automática basada en tipo
<MyRnd widgetData={{type: "image", ...}}>
  <ImageWidget />
</MyRnd>
```

### **Comportamientos por Tipo**

#### **Imagen** 📸
- **Handles**: Todos disponibles
- **Aspect Ratio**: Condicional (esquinas mantienen proporción, lados libres)
- **Restricciones**: 50-800px ancho, 50-600px alto

#### **Texto** 📝  
- **Handles**: Solo horizontal (izquierda/derecha)
- **Aspect Ratio**: Libre
- **Restricciones**: Altura mínima 30px

#### **Rectángulo** 📐
- **Handles**: Todos disponibles
- **Aspect Ratio**: Libre
- **Restricciones**: Mínimas (50x50px)

#### **Círculo** ⭕
- **Handles**: Todos disponibles  
- **Aspect Ratio**: Condicional (esquinas=círculo, lados=elipse)
- **Restricciones**: Mínimas

#### **Estrella** ⭐
- **Handles**: Solo esquinas
- **Aspect Ratio**: Siempre cuadrado (1:1)
- **Restricciones**: Mínimo 60x60px

## 🎮 Funcionalidades Principales

### **1. Drag Libre con Auto-Delete**
- **Movimiento**: Completamente libre, sin restricciones de canvas
- **Auto-eliminación**: Si el widget queda 100% fuera del canvas al soltar
- **Tolerancia**: Permite elementos parcialmente fuera durante el drag

```javascript
// Condiciones de auto-delete
const isCompletelyOutside = (
  x + width < 0 ||           // Fuera por izquierda
  x > canvasWidth ||         // Fuera por derecha  
  y + height < 0 ||          // Fuera por arriba
  y > canvasHeight           // Fuera por abajo
);
```

### **2. Resize con Aspect Ratio Inteligente**
- **Modo "conditional"**: Esquinas mantienen proporción, lados libres
- **Modo "square"**: Siempre proporción 1:1 (estrellas)
- **Modo "free"**: Sin restricciones (rectángulos, texto)
- **Modo "locked"**: Siempre mantiene proporción original

```javascript
// Lógica por handle
const shouldLockForThisHandle = (widgetType, handle) => {
  if (aspectRatio === "conditional") {
    const isCorner = ["topLeft", "topRight", "bottomLeft", "bottomRight"].includes(handle);
    const isSide = ["top", "right", "bottom", "left"].includes(handle);
    return isCorner ? true : false; // Esquinas sí, lados no
  }
  return aspectRatio === "locked" || aspectRatio === "square";
};
```

### **3. Handles Dinámicos**
Solo se renderizan los handles relevantes para cada tipo de widget:

```jsx
// Filtrado inteligente
const visibleHandles = allHandles.filter(handle => activeHandles[handle]);

// Estructura dual para mejor control
{visibleHandles.map(handle => (
  <div className={`resize-handle-container resize-handle-container-${handle}`}>
    <div className={`resize-handle-visual resize-handle-visual-${handle}`} />
  </div>
))}
```

## 🎨 Estados Visuales

### **Estados de Interacción**
- **Normal**: Handles ocultos, borde transparente
- **Seleccionado**: Borde naranja, handles visibles
- **Hover Handle**: Gradiente naranja, escala 1.15x
- **Dragging**: Handles ocultos, cursor grabbing
- **Resizing**: Cursor direccional específico

### **Animaciones CSS**
```css
/* Transiciones fluidas */
.resize-handle-visual {
  transition: all 0.15s ease;
  transform: translate3d(0, 0, 0); /* Hardware acceleration */
}

/* Hover effects nativos */
.resize-handle-container:hover .resize-handle-visual {
  background: linear-gradient(135deg, #FF6010 0%, #E55A0E 100%);
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(255, 96, 16, 0.4);
}
```

## 🚀 Uso del Sistema

### **Básico**
```jsx
import { MyRnd } from './components/myrnd';

<MyRnd
  size={{width: 200, height: 150}}
  position={{x: 100, y: 100}}
  widgetData={{type: "image", id: "img1"}} // 🎯 Configuración automática
  isSelected={true}
  canvasWidth={960}
  canvasHeight={540}
  onDragStop={(e, position) => updateWidget(id, position)}
  onResizeStop={(e, handle, data) => updateWidget(id, data)}
>
  <ImageWidget src="photo.jpg" />
</MyRnd>
```

### **Props Principales**
- `widgetData` - Datos del widget (tipo determina comportamiento)
- `size`/`position` - Dimensiones y posición
- `isSelected` - Muestra/oculta handles de resize
- `canvasWidth`/`canvasHeight` - Dimensiones del canvas para bounds
- `onDragStop`/`onResizeStop` - Callbacks al finalizar interacciones

## 📊 Ventajas del Sistema

### **Para Desarrolladores**
- ✅ **Configuración declarativa**: Un tipo = comportamiento completo
- ✅ **Extensibilidad**: Agregar widget requiere solo definir configuración
- ✅ **Mantenibilidad**: Lógica separada en hooks especializados
- ✅ **Debugging**: Responsabilidades claras por módulo

### **Para Usuarios**  
- ✅ **UX consistente**: Cada tipo se comporta como se espera
- ✅ **Handles relevantes**: Solo se muestran los necesarios
- ✅ **Aspect ratio inteligente**: Esquinas vs lados diferenciados
- ✅ **Interacciones fluidas**: 60fps con hardware acceleration

### **Para el Sistema**
- ✅ **Performance**: Solo renders necesarios, CSS para efectos visuales
- ✅ **Escalabilidad**: Sistema extensible sin modificar componentes
- ✅ **Consistencia**: Comportamiento predecible entre widgets
- ✅ **Modularidad**: Cada hook maneja una responsabilidad específica

## 🛠️ Agregar Nuevo Widget

### **1. Definir Configuración**
```javascript
// En widgetResizeConfig.js
myNewWidget: {
  handles: "corners",        // Qué handles mostrar
  aspectRatio: "square",     // Comportamiento de proporción
  constraints: "medium",     // Restricciones de tamaño
}
```

### **2. Usar en el Sistema**
```jsx
<MyRnd widgetData={{type: "myNewWidget"}}>
  <MyNewWidget />
</MyRnd>
```

¡El sistema automáticamente aplicará el comportamiento configurado!

## 🔍 Integración con el Editor

MyRnd está completamente integrado con el sistema del Web Editor:

```
App.jsx (useWidgetManager) → EditorCanvas → InteractiveWidget → MyRnd → Widget Components
```

- **InteractiveWidget** maneja la integración
- **MyRnd** proporciona interacciones
- **Widget Components** renderizan contenido

---

**MyRnd es un sistema completo, configurable y optimizado que hace que las interacciones de drag & resize sean fluidas, intuitivas y extensibles.** 🎉
