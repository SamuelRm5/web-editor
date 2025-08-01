# 🎯 Sistema de Configuración de Resize - Guía de Uso

## 📋 Resumen

El nuevo sistema de configuración centralizada permite definir fácilmente el comportamiento de resize y aspect ratio para cada tipo de widget de forma declarativa y escalable.

## 🏗️ Arquitectura

```
widgetResizeConfig.js → MyRnd.jsx → useResizeLogic.js → ResizeHandles.jsx
```

### **Flujo de Configuración**

1. **`widgetResizeConfig.js`** - Define comportamientos centralizados
2. **`MyRnd.jsx`** - Obtiene y aplica configuraciones dinámicamente  
3. **`useResizeLogic.js`** - Implementa lógica avanzada de aspect ratio
4. **`ResizeHandles.jsx`** - Muestra solo handles relevantes

## 🎮 Configuraciones Disponibles

### **Handle Configs** - Qué handles mostrar
```javascript
const HANDLE_CONFIGS = {
  all: { /* todos los handles */ },
  corners: { /* solo esquinas */ },
  sides: { /* solo lados */ },
  horizontal: { /* solo izquierda/derecha */ },
  vertical: { /* solo arriba/abajo */ },
};
```

### **Aspect Ratio Configs** - Cómo mantener proporciones
```javascript
const ASPECT_CONFIGS = {
  free: false,           // Sin restricciones
  locked: true,          // Mantener proporción original
  square: "square",      // Forzar cuadrado 1:1
  conditional: {         // Híbrido: esquinas locked, lados free
    type: "conditional",
    cornerHandles: true,
    sideHandles: false,
  },
};
```

### **Constraint Configs** - Límites de tamaño
```javascript
const CONSTRAINT_CONFIGS = {
  minimal: { minWidth: 50, minHeight: 50 },
  image: { minWidth: 50, minHeight: 50, maxWidth: 800, maxHeight: 600 },
  square: { minWidth: 50, minHeight: 50, enforceSquare: true },
};
```

## 🆕 Agregar un Nuevo Widget

### **1. Definir Comportamiento**
```javascript
// En widgetResizeConfig.js
const WIDGET_BEHAVIORS = {
  myNewWidget: {
    handles: "corners",      // Solo esquinas
    aspectRatio: "square",   // Forzar cuadrado
    constraints: "medium",   // Restricciones medianas
  },
};
```

### **2. Crear el Widget** 
```javascript
// En widgetFactory.js
const WIDGET_DEFAULTS = {
  myNewWidget: {
    x: 200,
    y: 200,
    width: 100,
    height: 100,
    // ... otras propiedades
  },
};
```

### **3. Renderizar el Widget**
```javascript
// En WidgetRenderer.jsx
case "myNewWidget":
  return <MyNewWidget {...props} />;
```

### **4. Agregar a Toolbar**
```javascript
// En Toolbar.jsx
<button onClick={() => onAddWidget("myNewWidget")}>
  Add My Widget
</button>
```

¡Y ya está! El sistema automáticamente aplicará todas las configuraciones.

## 🔧 Configuraciones Avanzadas

### **Aspect Ratio Condicional**
Para widgets que necesitan diferentes comportamientos según el handle:

```javascript
myWidget: {
  handles: "all",
  aspectRatio: "conditional", // ✅ Esquinas mantienen ratio, lados no
  constraints: "minimal",
}
```

### **Handles Personalizados**
Para necesidades específicas:

```javascript
// Registrar nueva configuración
registerHandleConfig("customHandles", {
  topLeft: true,
  bottomRight: true,
  right: true,
  // Solo estos tres handles
});

// Usar en widget
myWidget: {
  handles: "customHandles", // ✅ Usar configuración personalizada
  // ...
}
```

### **Restricciones Dinámicas**
Para límites específicos:

```javascript
registerConstraintConfig("largeImage", {
  minWidth: 100,
  minHeight: 100,
  maxWidth: 1200,
  maxHeight: 800,
});
```

## 📊 Ejemplos por Tipo de Widget

### **Imagen** 📸
```javascript
image: {
  handles: "all",           // Todos los handles
  aspectRatio: "locked",    // Mantener proporción original
  constraints: "image",     // Límites para imágenes
}
```
**Comportamiento**: Resize completo manteniendo proporción de la imagen.

### **Texto** 📝
```javascript
text: {
  handles: "horizontal",    // Solo izquierda/derecha
  aspectRatio: "free",      // Sin restricción de proporción
  constraints: "text",      // Altura mínima pequeña
}
```
**Comportamiento**: Solo redimensionar horizontalmente, altura libre.

### **Círculo** ⭕
```javascript
circle: {
  handles: "all",           // Todos los handles
  aspectRatio: "conditional", // Esquinas=cuadrado, lados=libre
  constraints: "minimal",   // Restricciones básicas
}
```
**Comportamiento**: Esquinas mantienen círculo perfecto, lados permiten elipse.

### **Estrella** ⭐
```javascript
star: {
  handles: "corners",       // Solo esquinas
  aspectRatio: "square",    // Siempre cuadrado
  constraints: "small",     // Tamaño mínimo mayor
}
```
**Comportamiento**: Solo resize desde esquinas, siempre mantiene forma cuadrada.

## 🚀 Beneficios del Sistema

### **🎯 Escalabilidad**
- ✅ Agregar widgets nuevos es trivial
- ✅ Modificar comportamientos centralizadamente
- ✅ Configuraciones reutilizables entre widgets

### **🔧 Flexibilidad**  
- ✅ Aspect ratio condicional (esquinas vs lados)
- ✅ Handles dinámicos por tipo de widget
- ✅ Restricciones personalizables

### **🛠️ Mantenibilidad**
- ✅ Lógica centralizada en un solo archivo
- ✅ Configuración declarativa vs. imperativa
- ✅ Fácil testing y debugging

### **🎨 UX Mejorada**
- ✅ Comportamiento consistente por tipo
- ✅ Solo mostrar handles relevantes
- ✅ Aspect ratio inteligente

## 🔍 Debugging y Troubleshooting

### **Verificar Configuración**
```javascript
import { getWidgetResizeConfig } from './utils/widgetResizeConfig';

// Debug configuración de un widget
console.log(getWidgetResizeConfig('myWidget'));
```

### **Problemas Comunes**

**Widget no redimensiona:**
- ✅ Verificar que el tipo está en `WIDGET_BEHAVIORS`
- ✅ Confirmar que `handles` apunta a configuración válida

**Aspect ratio no funciona:**
- ✅ Verificar configuración de `aspectRatio`
- ✅ Para "conditional", revisar lógica en `shouldLockAspectRatioForHandle`

**Handles no aparecen:**
- ✅ Verificar que la configuración de handles está bien definida
- ✅ Confirmar que `enableResizing` es `true`

## 📚 API Reference

### **Funciones Principales**

```javascript
getWidgetResizeConfig(widgetType) // Configuración completa
getHandleConfig(widgetType)       // Solo handles
getAspectRatioConfig(widgetType)  // Solo aspect ratio  
getConstraintConfig(widgetType)   // Solo restricciones
shouldLockAspectRatioForHandle(widgetType, handle) // Aspect ratio por handle
```

### **Funciones de Registro**

```javascript
registerWidgetBehavior(type, behavior)     // Nuevo widget
registerHandleConfig(name, config)         // Nueva config de handles
registerAspectConfig(name, config)         // Nueva config de aspect ratio
registerConstraintConfig(name, config)     // Nueva config de restricciones
```

---

Este sistema hace que agregar nuevos widgets sea tan simple como definir su comportamiento en unas pocas líneas de configuración. 🎉
