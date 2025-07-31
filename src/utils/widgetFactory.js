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
  text: {
    ...SETTINGS_DEFAULTS,
    content: "Texto de ejemplo\ncon saltos de línea",
    x: 100,
    y: 100,
    width: 200,
    height: 60, // Altura mínima más pequeña para permitir crecimiento automático
    fontSize: 16,
    fontFamily: "Arial",
    color: "#000000",
    bounds: true, // Los textos están limitados al canvas
  },
  image: {
    ...SETTINGS_DEFAULTS,
    content: "https://picsum.photos/300/200?random=1",
    x: 150,
    y: 150,
    width: 300,
    height: 200,
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

  return {
    id: uuidv4(),
    type,
    ...randomizedDefaults,
    ...overrides, // Los overrides tienen la mayor prioridad
  };
};
