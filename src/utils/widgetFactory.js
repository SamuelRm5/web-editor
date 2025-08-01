// src/utils/widgetFactory.js
import { v4 as uuidv4 } from "uuid";

const SETTINGS_DEFAULTS = {
  minWidth: 50,
  minHeight: 50,
  rotation: 0, // Rotación por defecto en grados
  bounds: true, // Por defecto, los widgets están limitados al canvas
};

// Configuraciones por defecto para cada tipo de widget
const WIDGET_DEFAULTS = {
  image: {
    ...SETTINGS_DEFAULTS,
    src: "https://picsum.photos/300/200?random=1", // Usar src en lugar de content
    x: 150,
    y: 150,
    width: 250, // Tamaño más pequeño por defecto
    height: 180, // Proporción más razonable
    bounds: false, // Las imágenes pueden salir del canvas y ser eliminadas
  },
  rectangle: {
    ...SETTINGS_DEFAULTS,
    x: 200,
    y: 200,
    width: 150,
    height: 100,
    color: "#3B82F6",
    bounds: true, // Los rectángulos están limitados al canvas
  },
  circle: {
    ...SETTINGS_DEFAULTS,
    x: 250,
    y: 250,
    width: 120,
    height: 120,
    color: "#10B981",
    bounds: false, // Los círculos pueden salir del canvas y ser eliminados
  },
  star: {
    ...SETTINGS_DEFAULTS,
    x: 350,
    y: 350,
    width: 120,
    height: 120,
    color: "#EF4444",
    bounds: true, // Las estrellas están limitadas al canvas
  },
};

// Función para calcular dimensiones optimizadas de imagen
const calculateImageDimensions = (
  naturalWidth,
  naturalHeight,
  maxWidth = 400,
  maxHeight = 300
) => {
  if (!naturalWidth || !naturalHeight) {
    // Fallback si no tenemos dimensiones
    return { width: 300, height: 200 };
  }

  // Si la imagen es más pequeña que el máximo, usar su tamaño natural
  if (naturalWidth <= maxWidth && naturalHeight <= maxHeight) {
    return { width: naturalWidth, height: naturalHeight };
  }

  // Calcular el factor de escala basado en el límite que se alcance primero
  const scaleWidth = maxWidth / naturalWidth;
  const scaleHeight = maxHeight / naturalHeight;
  const scale = Math.min(scaleWidth, scaleHeight);

  return {
    width: Math.round(naturalWidth * scale),
    height: Math.round(naturalHeight * scale),
  };
};

// Función para generar posiciones aleatorias para evitar superposición
const getRandomOffset = () => Math.floor(Math.random() * 100);

export const createWidget = (type, overrides = {}) => {
  const defaults = WIDGET_DEFAULTS[type];

  if (!defaults) {
    throw new Error(`Tipo de widget no soportado: ${type}`);
  }

  // Agregar un pequeño offset aleatorio para evitar superposición total
  const randomizedDefaults = {
    ...defaults,
    x: defaults.x + getRandomOffset(),
    y: defaults.y + getRandomOffset(),
  };

  // Para imágenes, usar la URL como src si se proporciona
  if (type === "image" && overrides.src) {
    return {
      id: uuidv4(),
      type,
      ...randomizedDefaults,
      src: overrides.src, // Asegurar que src esté presente
      ...overrides, // Los overrides tienen la mayor prioridad
    };
  }

  return {
    id: uuidv4(),
    type,
    ...randomizedDefaults,
    ...overrides, // Los overrides tienen la mayor prioridad
  };
};

// Función especializada para crear widgets de imagen con dimensiones optimizadas
export const createImageWidget = (src, imageElement = null, overrides = {}) => {
  let dimensions = { width: 300, height: 200 }; // Fallback

  if (imageElement && imageElement.naturalWidth && imageElement.naturalHeight) {
    dimensions = calculateImageDimensions(
      imageElement.naturalWidth,
      imageElement.naturalHeight
    );
  }

  return createWidget("image", {
    src,
    ...dimensions,
    ...overrides,
  });
};
