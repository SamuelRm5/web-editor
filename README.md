# 🎨 Web Editor - Visual Widget Editor

Un editor visual interactivo desarrollado en React que permite crear, editar y organizar widgets de forma intuitiva usando drag & drop.

![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.0.4-purple.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-cyan.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)

## 🚀 Características Principales

### 📦 **Tipos de Widgets Soportados**
- **Texto** - Editor enriquecido con formato dinámico
- **Formas Geométricas** - Rectángulos, círculos y estrellas
- **Imágenes** - Soporte para carga y manipulación de imágenes

### 🎯 **Funcionalidades Core**
- ✅ **Drag & Drop** - Posicionamiento libre y preciso
- ✅ **Redimensionamiento** - Handles de resize en tiempo real
- ✅ **Selección Visual** - Sistema de selección con indicadores
- ✅ **Modo Edición** - Edición directa de contenido (texto e imágenes)
- ✅ **Eliminación Inteligente** - Borrado automático al arrastrar fuera del canvas
- ✅ **Canvas Responsivo** - 960x540px con bounds automáticos

### 🛠️ **Arquitectura Modular**
- **Hooks Personalizados** - Lógica de negocio separada y reutilizable
- **Componentes Optimizados** - React.memo y useCallback para performance
- **Sistema de Estado** - Gestión eficiente del estado de widgets
- **MyRnd Library** - Sistema propio de drag & resize optimizado

## 📁 Estructura del Proyecto

```
web-editor/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── EditorCanvas.jsx    # Canvas principal del editor
│   │   ├── InteractiveWidget.jsx # Wrapper para widgets interactivos
│   │   ├── Toolbar.jsx         # Barra de herramientas
│   │   ├── Widget.jsx          # Componente base de widget
│   │   ├── myrnd/              # Sistema drag & resize personalizado
│   │   │   ├── MyRnd.jsx       # Componente principal de drag & resize
│   │   │   ├── components/
│   │   │   │   └── ResizeHandles.jsx # Handles de redimensionamiento
│   │   │   └── hooks/
│   │   │       ├── useBoundsLogic.js  # Lógica de límites del canvas
│   │   │       ├── useDragLogic.js    # Lógica de arrastre
│   │   │       └── useResizeLogic.js  # Lógica de redimensionamiento
│   │   └── widgets/
│   │       ├── CircleWidget.jsx       # Widget de círculo
│   │       ├── RectangleWidget.jsx    # Widget de rectángulo
│   │       ├── StarWidget.jsx         # Widget de estrella
│   │       ├── ImageWidget.jsx        # Widget de imagen
│   │       ├── TextWidget/            # Sistema completo de texto
│   │       │   ├── TextWidget.jsx
│   │       │   ├── TextWidgetDisplay.jsx
│   │       │   ├── TextWidgetEditor.jsx
│   │       │   ├── hooks/
│   │       │   │   └── useTextWidgetEditor.js
│   │       │   └── utils/
│   │       │       └── textWidgetUtils.js
│   │       └── WidgetRenderer.jsx     # Renderizador universal
│   ├── hooks/
│   │   └── useWidgetManager.js        # Gestión global de widgets
│   ├── styles/
│   │   └── editorCanvas.styles.js     # Estilos del canvas
│   ├── utils/
│   │   ├── widgetFactory.js           # Factory de widgets
│   │   └── widgetUtils.js             # Utilidades de widgets
│   ├── App.jsx                        # Aplicación principal
│   └── main.jsx                       # Punto de entrada
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🏗️ Tecnologías Utilizadas

### **Frontend Core**
- **React 19.1.0** - Framework principal con hooks modernos
- **Vite 7.0.4** - Build tool y desarrollo rápido
- **JavaScript ES6+** - Sintaxis moderna

### **Styling**
- **TailwindCSS 4.1.11** - Framework de CSS utility-first
- **CSS3** - Estilos personalizados y animaciones

### **Bibliotecas**
- **UUID 11.1.0** - Generación de IDs únicos
- **React DOM 19.1.0** - Renderizado DOM

### **Herramientas de Desarrollo**
- **ESLint** - Linting y calidad de código
- **Vite Plugin React** - Integración optimizada React/Vite

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 16+ 
- npm o yarn

### **Instalación**
```bash
# Clonar el repositorio
git clone <repository-url>
cd web-editor

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Preview del build de producción
npm run preview

# Ejecutar linting
npm run lint
```

### **Scripts Disponibles**
- `npm run dev` - Servidor de desarrollo (localhost:5173 o 5174)
- `npm run build` - Build optimizado para producción
- `npm run preview` - Preview del build de producción
- `npm run lint` - Análisis de código con ESLint

## 🎮 Guía de Uso

### **Crear Widgets**
1. **Texto**: Click en "Add Text" en la toolbar
2. **Formas**: Selecciona Rectangle, Circle o Star
3. **Imagen**: Click en "Add Image" y selecciona archivo

### **Interacciones**
- **Mover**: Arrastra cualquier widget por el canvas
- **Redimensionar**: Usa los handles en las esquinas (cuando está seleccionado)
- **Editar**: Doble click para entrar en modo edición
- **Seleccionar**: Click simple para seleccionar
- **Eliminar**: Arrastra fuera del canvas o selecciona y presiona Delete

### **Toolbar Funciones**
- **Add Text** - Crear widget de texto
- **Add Rectangle** - Crear rectángulo
- **Add Circle** - Crear círculo  
- **Add Star** - Crear estrella
- **Add Image** - Subir y crear widget de imagen
- **Remove Selected** - Eliminar widget seleccionado
- **Clear All** - Limpiar todo el canvas

## 🏛️ Arquitectura del Sistema

### **Patrón de Diseño**
- **Separation of Concerns** - Lógica separada en hooks especializados
- **Component Composition** - Composición modular de componentes
- **State Management** - Estado centralizado con useWidgetManager
- **Event-Driven** - Sistema basado en eventos y callbacks

### **Hooks Personalizados**

#### **useWidgetManager**
Gestión global del estado de widgets:
- Estados: `widgets`, `selectedId`, `editingWidgetId`
- Acciones: `addWidget`, `updateWidget`, `removeWidget`, `selectWidget`

#### **useDragLogic**
Manejo del sistema de drag & drop:
- Control de estado de arrastre
- Cálculos de posición en tiempo real
- Integración con bounds checking

#### **useResizeLogic**
Sistema de redimensionamiento:
- Handles dinámicos en 8 direcciones
- Preservación de aspect ratio (opcional)
- Límites mínimos y máximos

#### **useBoundsLogic**
Control de límites del canvas:
- Detección de widgets fuera de bounds
- Eliminación automática cuando salen completamente
- Validación de posiciones

### **Sistema MyRnd**
Biblioteca interna de drag & resize:
- **Performance Optimizada** - Eventos optimizados y memoización
- **Modular** - Lógica separada en hooks especializados
- **Flexible** - Configuración granular de comportamientos
- **Accesible** - Soporte para teclado y eventos múltiples

## 🎨 Personalización

### **Agregar Nuevos Tipos de Widget**
1. Crear componente en `src/components/widgets/`
2. Registrar en `widgetFactory.js`
3. Añadir al `WidgetRenderer.jsx`
4. Agregar botón en `Toolbar.jsx`

### **Modificar Estilos**
- **Canvas**: Editar `editorCanvas.styles.js`
- **Widgets**: Modificar `Widget.css` y estilos de Tailwind
- **Toolbar**: Ajustar `Toolbar.css`

### **Configuración del Canvas**
```javascript
// En editorCanvas.styles.js
export const canvasStyles = {
  width: 960,    // Ancho del canvas
  height: 540,   // Alto del canvas
  // ... otros estilos
};
```

## 🔧 Configuración Avanzada

### **Vite Configuration**
```javascript
// vite.config.js - Configuración optimizada
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ... configuraciones adicionales
})
```

### **TailwindCSS Setup**
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Personalizaciones del tema
    }
  }
}
```

## 🐛 Troubleshooting

### **Problemas Comunes**

**Widgets no se mueven correctamente:**
- Verificar que `dragHandleClassName="drag-handle"` esté presente
- Asegurar que no hay conflictos de z-index

**Redimensionamiento no funciona:**
- Confirmar que `enableResizing={true}` en MyRnd
- Verificar que los handles están visibles

**Errores de posición NaN:**
- El sistema incluye validación automática de NaN
- Verificar que las posiciones iniciales son números válidos

### **Debugging**
```javascript
// Activar logs de desarrollo
console.log('Widget state:', widget);
console.log('Position:', { x, y });
```

## 📈 Performance

### **Optimizaciones Implementadas**
- **React.memo** - Evita re-renders innecesarios
- **useCallback** - Memoización de funciones
- **useMemo** - Cálculos costosos memoizados
- **Event Delegation** - Eventos globales optimizados

### **Metrics Objetivo**
- Tiempo de carga inicial: < 2s
- Framerate durante drag: 60fps
- Memoria usage: < 50MB para 100 widgets

## 🤝 Contribución

### **Guidelines**
1. Seguir la estructura de hooks separados
2. Usar TypeScript en futuras adiciones
3. Mantener tests para nuevas funcionalidades
4. Documentar cambios en el API

### **Code Style**
- ESLint configuration incluida
- Prettier recomendado para formato
- Nombres descriptivos en español/inglés consistente

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

---

## 🔮 Roadmap Futuro

### **v1.1 - Próximas Características**
- [ ] Sistema de capas (z-index management)
- [ ] Undo/Redo functionality
- [ ] Exportación a imagen/PDF
- [ ] Templates predefinidos

### **v1.2 - Mejoras Avanzadas**
- [ ] Colaboración en tiempo real
- [ ] Más tipos de widgets (charts, tables)
- [ ] Animaciones y transiciones
- [ ] Sistema de plugins

---

**Desarrollado con ❤️ usando React y Vite**
