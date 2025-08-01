// src/utils/widgetResizeConfig.js

/**
 * SISTEMA DE CONFIGURACIÓN CENTRALIZADA PARA RESIZE Y ASPECT RATIO
 *
 * Este archivo centraliza todas las configuraciones de comportamiento de resize
 * para los widgets, haciendo fácil agregar nuevos tipos y modificar comportamientos.
 */

// Configuraciones de handles predefinidas
const HANDLE_CONFIGS = {
  all: {
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
    top: true,
    right: true,
    bottom: true,
    left: true,
  },
  corners: {
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
    top: false,
    right: false,
    bottom: false,
    left: false,
  },
  sides: {
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false,
    top: true,
    right: true,
    bottom: true,
    left: true,
  },
  horizontal: {
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false,
    top: false,
    right: true,
    bottom: false,
    left: true,
  },
  vertical: {
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false,
    top: true,
    right: false,
    bottom: true,
    left: false,
  },
};

// Configuraciones de aspect ratio predefinidas
const ASPECT_CONFIGS = {
  free: false, // Redimensionamiento libre
  locked: true, // Mantener proporción original
  square: "square", // Forzar cuadrado 1:1
  conditional: {
    // Híbrido: esquinas locked, lados free
    type: "conditional",
    cornerHandles: true,
    sideHandles: false,
  },
};

// Configuraciones de restricciones predefinidas
const CONSTRAINT_CONFIGS = {
  minimal: { minWidth: 50, minHeight: 50 },
  small: { minWidth: 60, minHeight: 60 },
  medium: { minWidth: 100, minHeight: 100 },
  large: { minWidth: 150, minHeight: 150 },
  image: { minWidth: 50, minHeight: 50, maxWidth: 800, maxHeight: 600 },
  square: { minWidth: 50, minHeight: 50, enforceSquare: true },
  text: { minWidth: 50, minHeight: 30 }, // Específico para texto
};

/**
 * REGISTRY CENTRALIZADO DE WIDGETS
 *
 * Aquí defines el comportamiento de cada widget de forma simple y descriptiva
 */
const WIDGET_BEHAVIORS = {
  image: {
    handles: "all", // Usar configuración "all"
    aspectRatio: "conditional", // Esquinas mantienen aspect ratio, lados libres
    constraints: "image", // Restricciones para imágenes
  },

  rectangle: {
    handles: "all", // Todos los handles
    aspectRatio: "free", // Redimensionamiento libre
    constraints: "minimal", // Restricciones mínimas
  },

  circle: {
    handles: "all", // Todos los handles
    aspectRatio: "conditional", // Híbrido: esquinas mantienen proporción
    constraints: "minimal", // Restricciones mínimas
  },

  star: {
    handles: "corners", // Solo esquinas
    aspectRatio: "square", // Forzar cuadrado
    constraints: "small", // Restricciones pequeñas
  },

  text: {
    handles: "horizontal", // Solo horizontal para texto
    aspectRatio: "free", // Sin restricción de proporción
    constraints: "text", // Restricciones específicas de texto
  },
};

/**
 * Resuelve la configuración de handles para un widget dado
 */
export const getHandleConfig = (widgetType) => {
  const behavior = WIDGET_BEHAVIORS[widgetType];
  if (!behavior) {
    console.warn(
      `Widget type "${widgetType}" not found, using default "all" handles`
    );
    return HANDLE_CONFIGS.all;
  }

  const config = HANDLE_CONFIGS[behavior.handles];
  if (!config) {
    console.warn(
      `Handle config "${behavior.handles}" not found, using default "all"`
    );
    return HANDLE_CONFIGS.all;
  }

  return config;
};

/**
 * Resuelve la configuración de aspect ratio para un widget dado
 */
export const getAspectRatioConfig = (widgetType) => {
  const behavior = WIDGET_BEHAVIORS[widgetType];
  if (!behavior) {
    console.warn(
      `Widget type "${widgetType}" not found, using default "free" aspect ratio`
    );
    return ASPECT_CONFIGS.free;
  }

  const config = ASPECT_CONFIGS[behavior.aspectRatio];
  if (config === undefined) {
    console.warn(
      `Aspect ratio config "${behavior.aspectRatio}" not found, using default "free"`
    );
    return ASPECT_CONFIGS.free;
  }

  return config;
};

/**
 * Resuelve la configuración de restricciones para un widget dado
 */
export const getConstraintConfig = (widgetType) => {
  const behavior = WIDGET_BEHAVIORS[widgetType];
  if (!behavior) {
    console.warn(
      `Widget type "${widgetType}" not found, using default "minimal" constraints`
    );
    return CONSTRAINT_CONFIGS.minimal;
  }

  const config = CONSTRAINT_CONFIGS[behavior.constraints];
  if (!config) {
    console.warn(
      `Constraint config "${behavior.constraints}" not found, using default "minimal"`
    );
    return CONSTRAINT_CONFIGS.minimal;
  }

  return config;
};

/**
 * Función principal que resuelve todas las configuraciones para un widget
 */
export const getWidgetResizeConfig = (widgetType) => {
  return {
    handles: getHandleConfig(widgetType),
    aspectRatio: getAspectRatioConfig(widgetType),
    constraints: getConstraintConfig(widgetType),
  };
};

/**
 * Verifica si un handle específico debe mantener aspect ratio
 * Útil para el sistema "conditional"
 */
export const shouldLockAspectRatioForHandle = (widgetType, handle) => {
  const aspectConfig = getAspectRatioConfig(widgetType);

  // Si es un boolean simple, retornarlo
  if (typeof aspectConfig === "boolean") {
    return aspectConfig;
  }

  // Si es "square", siempre mantener ratio
  if (aspectConfig === "square") {
    return true;
  }

  // Si es conditional, verificar el tipo de handle
  if (aspectConfig?.type === "conditional") {
    const isCornerHandle = [
      "topLeft",
      "topRight",
      "bottomLeft",
      "bottomRight",
    ].includes(handle);
    const isSideHandle = ["top", "right", "bottom", "left"].includes(handle);

    if (isCornerHandle) return aspectConfig.cornerHandles;
    if (isSideHandle) return aspectConfig.sideHandles;
  }

  return false;
};

/**
 * Utilidades para desarrolladores - agregar nuevos comportamientos fácilmente
 */

/**
 * Registra un nuevo comportamiento de widget
 * Útil para plugins o widgets dinámicos
 */
export const registerWidgetBehavior = (widgetType, behavior) => {
  WIDGET_BEHAVIORS[widgetType] = behavior;
};

/**
 * Registra una nueva configuración de handles
 */
export const registerHandleConfig = (name, config) => {
  HANDLE_CONFIGS[name] = config;
};

/**
 * Registra una nueva configuración de aspect ratio
 */
export const registerAspectConfig = (name, config) => {
  ASPECT_CONFIGS[name] = config;
};

/**
 * Registra una nueva configuración de restricciones
 */
export const registerConstraintConfig = (name, config) => {
  CONSTRAINT_CONFIGS[name] = config;
};

// Exportar las configuraciones base para casos avanzados
export { HANDLE_CONFIGS, ASPECT_CONFIGS, CONSTRAINT_CONFIGS, WIDGET_BEHAVIORS };
