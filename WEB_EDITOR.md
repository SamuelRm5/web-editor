# 🎨 Web Editor - Contexto del Proyecto

## 📋 Descripción General

**Web Editor** es una aplicación de edición visual desarrollada en React que permite crear, editar y manipular widgets de forma interactiva en un canvas. Es similar a herramientas como Figma o Canva, pero enfocado en la creación de elementos gráficos básicos con capacidades de texto, formas geométricas e imágenes.

## 🏗️ Arquitectura del Proyecto

### **Stack Tecnológico**
- **Frontend Framework**: React 19.1.0 con hooks
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 4.1.11
- **Interacciones**: react-rnd 10.5.2 (drag & drop, resize)
- **ID Generation**: uuid 11.1.0
- **Linting**: ESLint 9.30.1

### **Estructura de Carpetas**
```
src/
├── components/           # Componentes principales
│   ├── EditorCanvas.jsx     # Canvas principal del editor
│   ├── InteractiveWidget.jsx # Wrapper para widgets interactivos
│   ├── ResizeIndicators.jsx  # Indicadores visuales de redimensión
│   ├── SnapGuides.jsx       # Guías de alineación automática
│   ├── Toolbar.jsx          # Barra de herramientas
│   ├── Widget.jsx           # Componente base de widget
│   └── widgets/             # Tipos específicos de widgets
│       ├── TextWidget/      # Widget de texto con editor completo
│       ├── ImageWidget.jsx  # Widget de imagen (placeholder)
│       ├── RectangleWidget.jsx # Widget de rectángulo
│       ├── CircleWidget.jsx    # Widget de círculo  
│       ├── StarWidget.jsx      # Widget de estrella
│       └── WidgetRenderer.jsx  # Renderizador universal
├── hooks/                # Custom hooks para lógica reutilizable
│   ├── useWidgetManager.js     # Gestión de estado de widgets
│   ├── useWidgetInteractions.js # Lógica de interacciones
│   ├── useSnapGuides.js        # Sistema de guías de alineación
│   └── useOptimizedDrag.js     # Optimizaciones de arrastre
├── utils/                # Utilidades y helpers
│   ├── widgetFactory.js       # Factory para crear widgets
│   └── widgetUtils.js         # Utilidades de configuración
└── styles/               # Estilos organizados
    └── editorCanvas.styles.js # Estilos del canvas
```

## 🎯 Funcionalidades Principales

### **1. Gestión de Widgets**
- **Crear**: Texto, formas (rectángulo, círculo, estrella), imágenes
- **Seleccionar**: Click para seleccionar, visual feedback con borde naranja
- **Editar**: Doble click para entrar en modo edición (especialmente texto)
- **Eliminar**: Botón de eliminar o arrastrar fuera del canvas
- **Limpiar**: Botón para eliminar todos los widgets

### **2. Interacciones Avanzadas**
- **Drag & Drop**: Arrastre fluido con optimizaciones de rendimiento
- **Resize**: Redimensionamiento con controles visuales y aspect ratio
- **Snap Guides**: Alineación automática con guías visuales
- **Auto-resize**: Los widgets de texto se ajustan automáticamente al contenido

### **3. Editor de Texto Avanzado**
- **Modo Edición**: Textarea completa con auto-resize inteligente
- **Formato**: Negrita, cursiva, subrayado, tachado
- **Alineación**: Izquierda, centro, derecha
- **Tipografía**: Familia de fuente, tamaño, color
- **Multilinea**: Soporte completo para texto multilínea con saltos de línea

### **4. Sistema de Formas**
- **Rectángulo**: Forma básica con color personalizable
- **Círculo**: Forma circular con aspect ratio locked
- **Estrella**: Forma de estrella con gradiente SVG
- **Colores**: Personalizables para cada forma

## 🔧 Hooks Personalizados y Lógica

### **useWidgetManager**
- **Estado central** de la aplicación
- Gestiona: widgets[], selectedId, editingWidgetId
- **Acciones**: add, update, remove, select, edit modes

### **useWidgetInteractions**
- **Lógica de interacciones** (drag, resize, click)
- **Detección de límites** del canvas
- **Auto-eliminación** cuando se arrastra fuera
- **Integración con snap guides**

### **useSnapGuides**
- **Sistema de alineación** automática
- **Guías visuales** (vertical/horizontal)
- **Snap threshold** de 10px
- **Throttling optimizado** para performance

### **useTextWidgetEditor**
- **Auto-resize inteligente** del textarea
- **Gestión de cursor** y scroll position
- **Limpieza automática** de saltos de línea
- **Performance optimizations** para edición fluida

## 🎨 Sistema de Estilos

### **CSS Architecture**
- **Widget.css**: Estilos base y optimizaciones de rendimiento
- **Toolbar.css**: Interfaz de herramientas con diseño moderno
- **Tailwind**: Utilidades para layout y componentes
- **Hardware Acceleration**: Transform3d para performance

### **Estados Visuales**
- **Normal**: Transparente, hover con borde naranja
- **Selected**: Borde sólido naranja con resize indicators
- **Editing**: Borde punteado, fondo semi-transparente
- **Dragging**: Optimizaciones de rendimiento, z-index elevado

## ⚡ Optimizaciones de Rendimiento

### **Hardware Acceleration**
```css
transform: translate3d(0, 0, 0);
will-change: transform;
backface-visibility: hidden;
```

### **Containment Strategy**
- **Layout containment** durante drag
- **Style containment** en reposo
- **Paint optimization** para elementos complejos

### **React Optimizations**
- **memo()** en componentes pesados
- **useMemo()** para cálculos costosos
- **useCallback()** para funciones estables
- **Throttling** en snap guides (16ms/60fps)

## 🚀 Canvas System

### **Dimensiones y Grid**
- **Tamaño**: 960x540px (16:9 ratio)
- **Background**: Grid pattern con puntos
- **Drag Grid**: Snap a 5px increments
- **Resize Grid**: 1px precision

### **Coordinate System**
- **Origin**: Top-left (0,0)
- **Units**: Pixels
- **Bounds checking**: Auto-removal outside canvas
- **Z-index management**: Drag > Selected > Normal

## 📦 Widget System

### **Widget Data Structure**
```javascript
{
  id: "uuid",           // Unique identifier
  type: "text|image|rectangle|circle|star",
  x: 100,              // Position X
  y: 100,              // Position Y  
  width: 200,          // Width in pixels
  height: 100,         // Height in pixels
  content: "...",      // Widget-specific content
  // Type-specific properties (fontSize, color, etc.)
}
```

### **Widget Factory**
- **Defaults por tipo** con configuraciones sensatas
- **Random offset** para evitar superposición
- **Extensibilidad** para nuevos tipos de widget

### **Resize Configuration**
- **Por tipo**: Configuración específica de resize handles
- **Aspect ratio**: Locked para círculos e imágenes
- **Min sizes**: Prevención de widgets demasiado pequeños

## 🔄 Estado y Flujo de Datos

### **Estado Global (useWidgetManager)**
```
widgets[] ←→ selectedId ←→ editingWidgetId
    ↓           ↓            ↓
 Canvas    ResizeIndicators  TextEditor
```

### **Flujo de Eventos**
1. **User Action** (click, drag, type)
2. **Hook Processing** (useWidgetInteractions)
3. **State Update** (useWidgetManager)
4. **Re-render** (React optimization with memo)
5. **Visual Feedback** (CSS states + animations)

## 🎯 Casos de Uso Principales

### **Creación de Contenido**
1. Seleccionar tipo de widget en toolbar
2. Widget aparece en canvas con valores por defecto
3. Configurar propiedades específicas
4. Posicionar y redimensionar según necesidad

### **Edición de Texto**
1. Doble click en widget de texto
2. Modo edición con textarea
3. Auto-resize durante escritura
4. Click fuera para confirmar cambios

### **Alineación Precisa**
1. Arrastrar widget cerca de otros elementos
2. Snap guides aparecen automáticamente
3. Posición se ajusta al soltar
4. Guías desaparecen tras completar acción

## 🛠️ Comandos de Desarrollo

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Análisis de código
```

## 🔮 Extensibilidad

### **Agregar Nuevo Widget**
1. Crear componente en `src/components/widgets/`
2. Añadir configuración en `widgetFactory.js`
3. Registrar en `WidgetRenderer.jsx`
4. Definir resize config en `widgetUtils.js`

### **Nuevas Funcionalidades**
- **Layers/Z-index management**
- **Grouping de widgets** 
- **Undo/Redo system**
- **Export/Import JSON**
- **Collaborative editing**
- **More shape types**
- **Image upload real**
- **Background patterns**

## 📝 Notas de Implementación

### **Performance Considerations**
- Canvas limitado a elementos visibles
- Throttling en eventos de alta frecuencia
- Hardware acceleration en elementos móviles
- Memoization de cálculos pesados

### **UX Considerations**
- Visual feedback inmediato en todas las acciones
- Snap guides para alineación intuitiva
- Auto-resize en texto para mejor usabilidad
- Estados visuales claros (selected, editing, dragging)

### **Browser Compatibility**
- Modern browsers (ES6+ features)
- CSS Grid y Flexbox support
- Transform3d support para hardware acceleration

---

**Último Update**: Julio 2025 - Versión estable con optimizaciones de rendimiento implementadas
