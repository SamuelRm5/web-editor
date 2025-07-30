// src/utils/widgetFactory.js
import { v4 as uuidv4 } from "uuid";

const SETTINGS_DEFAULTS = {
  minWidth: 50,
  minHeight: 50,
};

// Configuraciones por defecto para cada tipo de widget
const WIDGET_DEFAULTS = {
  text: {
    content: "Texto de ejemplo\ncon saltos de línea",
    x: 100,
    y: 100,
    width: 200,
    height: 60, // Altura mínima más pequeña para permitir crecimiento automático
    fontSize: 16,
    fontFamily: "Arial",
    color: "#000000",
  },
  image: {
    content: "🖼️ Imagen",
    x: 150,
    y: 150,
    width: 300,
    height: 200,
  },
  rectangle: {
    ...SETTINGS_DEFAULTS,
    x: 200,
    y: 200,
    width: 150,
    height: 100,
    color: "#3B82F6",
  },
  circle: {
    ...SETTINGS_DEFAULTS,
    x: 250,
    y: 250,
    width: 120,
    height: 120,
    color: "#10B981",
  },
  star: {
    ...SETTINGS_DEFAULTS,
    x: 350,
    y: 350,
    width: 120,
    height: 120,
    color: "#EF4444",
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
